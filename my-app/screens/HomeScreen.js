import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import api from './api';

export default function HomeScreen({ navigation, route }) {
  const professor = route.params;

  const [turmas, setTurmas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [materiaAtual, setMateriaAtual] = useState("");
  const [carregandoAlunos, setCarregandoAlunos] = useState(false);
  const [registrandoFalta, setRegistrandoFalta] = useState(null); // Armazena o ID do aluno que está registrando falta

  // Função para carregar turmas
  async function carregarTurmas() {
    try {
      const response = await api.get(`/minhas-turmas/${professor.id}`);
      setTurmas(response.data.turmas);
    } catch (error) {
      console.log("Erro ao carregar turmas", error);
    }
  }

  // Função para carregar alunos
  async function carregarAlunos(idTurma) {
    setCarregandoAlunos(true);
    try {
      const response = await api.get(
        `/alunos-professor/${professor.id}/${idTurma}`
      );
      setAlunos(response.data.alunos);
      if (response.data.materia) {
        setMateriaAtual(response.data.materia);
      }
    } catch (error) {
      console.log("Erro ao carregar alunos", error);
      Alert.alert("Erro", "Não foi possível carregar os alunos.");
    } finally {
      setCarregandoAlunos(false);
    }
  }

  // Função para registrar falta
  async function registrarFalta(aluno) {
    setRegistrandoFalta(aluno.id_aluno); // Marca que está registrando falta para este aluno

    try {
      const dataAtual = new Date().toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD

      const response = await api.post('/registrar-falta', {
        data: dataAtual,
        nome_aluno: aluno.nome,
        nome_materia: materiaAtual
      });

      console.log('Falta registrada com sucesso:', response.data);

      // Atualiza a lista de alunos localmente sem precisar recarregar tudo
      setAlunos(alunosPrev =>
        alunosPrev.map(a =>
          a.id_aluno === aluno.id_aluno
            ? { ...a, faltas: a.faltas + 1 } // Incrementa o contador de faltas
            : a
        )
      );

      Alert.alert(
        "Sucesso",
        `Falta registrada para ${aluno.nome} em ${materiaAtual}`,
        [{ text: "OK" }]
      );

    } catch (error) {
      console.error('Erro ao registrar falta:', error);

      if (error.response) {
        Alert.alert("Erro", error.response.data.detail || "Erro ao registrar falta");
      } else {
        Alert.alert("Erro", "Não foi possível conectar ao servidor.");
      }
    } finally {
      setRegistrandoFalta(null); // Remove o indicador de carregamento
    }
  }

  // Carrega turmas na montagem inicial
  useEffect(() => {
    carregarTurmas();
  }, []);

  // Recarrega alunos quando a turma selecionada muda
  useEffect(() => {
    if (turmaSelecionada) {
      carregarAlunos(turmaSelecionada);
    }
  }, [turmaSelecionada]);

  // Usa useFocusEffect para recarregar dados quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      if (turmaSelecionada) {
        // Recarrega os dados da turma atual quando a tela ganha foco
        carregarAlunos(turmaSelecionada);
      }
      return () => { };
    }, [turmaSelecionada])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alunos</Text>

      {/* Botão do Chat IA */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate("ChatAI")}
      >
        <Text style={styles.chatButtonText}>Abrir Chat IA</Text>
      </TouchableOpacity>

      {/* FILTRO TURMA */}
      <View style={styles.filtrosLinha}>
        <View style={{ width: "100%" }}>
          <Text style={styles.filtroLabel}>Turma</Text>

          <View style={styles.pickerBox}>
            <Picker
              selectedValue={turmaSelecionada}
              onValueChange={(value) => {
                setTurmaSelecionada(value);
                if (value) {
                  carregarAlunos(value);
                } else {
                  setAlunos([]); // Limpa a lista se nenhuma turma estiver selecionada
                }
              }}
            >
              <Picker.Item label="Selecione a turma" value={null} />
              {turmas.map(t => (
                <Picker.Item
                  key={t.id_turma}
                  label={t.nome_turma}
                  value={t.id_turma}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Indicador de carregamento */}
      {carregandoAlunos && (
        <View style={styles.carregandoContainer}>
          <ActivityIndicator size="large" color="#512DA8" />
          <Text style={styles.carregandoTexto}>Carregando alunos...</Text>
        </View>
      )}

      {/* Se não há turma selecionada */}
      {!turmaSelecionada && !carregandoAlunos && (
        <View style={styles.semTurmaContainer}>
          <Text style={styles.semTurmaTexto}>Selecione uma turma para ver os alunos</Text>
        </View>
      )}

      {/* Se há turma selecionada mas não há alunos */}
      {turmaSelecionada && alunos.length === 0 && !carregandoAlunos && (
        <View style={styles.semAlunosContainer}>
          <Text style={styles.semAlunosTexto}>Nenhum aluno encontrado nesta turma</Text>
        </View>
      )}

      {/* TABELA - Só mostra se há alunos */}
      {alunos.length > 0 && (
        <>
          <View style={styles.infoTurma}>
            <Text style={styles.infoTurmaTexto}>
              Matéria: {materiaAtual} | {alunos.length} aluno{alunos.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.cellNome, styles.header]}>Nome</Text>
            <Text style={[styles.cellFaltas, styles.header]}>Faltas</Text>
            <Text style={[styles.cellAcoes, styles.header]}>Ações</Text>
          </View>

          <ScrollView style={styles.scrollTable}>
            {alunos.map(a => (
              <View key={a.id_aluno} style={styles.tableRow}>
                <Text style={styles.cellNome}>{a.nome}</Text>
                <Text style={styles.cellFaltas}>{a.faltas}</Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[
                      styles.btnAdicionarFalta,
                      registrandoFalta === a.id_aluno && styles.btnDesabilitado
                    ]}
                    onPress={() => registrarFalta(a)}
                    disabled={registrandoFalta === a.id_aluno}
                  >
                    {registrandoFalta === a.id_aluno ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={styles.btnAdicionarFaltaText}>+ Falta</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5"
  },
  chatButton: {
    backgroundColor: "#512DA8",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  chatButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginTop: 10,
  },
  filtrosLinha: {
    marginBottom: 20,
  },
  filtroLabel: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
    color: "#333"
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    backgroundColor: "#FFF",
    overflow: 'hidden',
  },
  carregandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  carregandoTexto: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  semTurmaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  semTurmaTexto: {
    color: "#999",
    fontSize: 18,
    textAlign: 'center',
  },
  semAlunosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  semAlunosTexto: {
    color: "#999",
    fontSize: 18,
    textAlign: 'center',
  },
  infoTurma: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  infoTurmaTexto: {
    color: "#1976D2",
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#512DA8",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 12,
  },
  scrollTable: {
    maxHeight: 400,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
    alignItems: 'center',
    minHeight: 60,
  },
  cellNome: {
    flex: 3,
    padding: 12,
    fontSize: 14,
    color: "#333",
  },
  cellFaltas: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: "#333",
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cellAcoes: {
    flex: 2,
    padding: 12,
  },
  header: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFF",
    fontSize: 14,
  },
  actions: {
    flex: 2,
    paddingHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  btnAdicionarFalta: {
    backgroundColor: "#F44336",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDesabilitado: {
    backgroundColor: "#FF8A80",
  },
  btnAdicionarFaltaText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold"
  }
});