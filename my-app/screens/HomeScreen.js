import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from './api';


export default function HomeScreen({ navigation, route }) {
  const professor = route.params;
  const [turmas, setTurmas] = useState([]);


  useEffect(() => {
    async function carregarTurmas() {
      try {
        const response = await api.get(`/minhas-turmas/${professor.id}`);
        setTurmas(response.data.turmas);
      } catch (error) {
        console.log("Erro ao carregar turmas", error);
      }
    }

    carregarTurmas();
  }, []);


  async function carregarAlunos(idTurma) {
    try {
      const response = await api.get(
        `/alunos-professor/${professor.id}/${idTurma}`
      );
      setAlunos(response.data.alunos);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alunos</Text>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate("ChatAI")}
      >
        <Text style={styles.chatButtonText}>Abrir Chat IA</Text>
      </TouchableOpacity>

      <View style={styles.filtrosLinha}>
        <View style={styles.filtroBox}>
          <Text style={styles.filtroLabel}>Curso</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={curso} onValueChange={(value) => {
              setTurma(value);
              carregarAlunos(value);
            }}>
              <Picker.Item label="" value="" />
            </Picker>
          </View>
        </View>

        <View style={styles.filtroBox}>
          <Text style={styles.filtroLabel}>Turma</Text>
          <View style={styles.pickerBox}>
            <Picker.Item label="" value="" />
            {turmas.map(t => (
              <Picker.Item
                key={t.id_turma}
                label={t.nome_turma}
                value={t.id_turma}
              />
            ))}
          </View>
        </View>
      </View>

      {/* TABELA */}
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.header]}>Curso</Text>
        <Text style={[styles.cell, styles.header]}>Turma</Text>
        <Text style={[styles.cellLarge, styles.header]}>Nome</Text>
        <Text style={[styles.cellLarge, styles.header]}>Presença</Text>
        <Text style={[styles.cellLarge, styles.header]}>Ações</Text>
      </View>

      <ScrollView>
        {alunos.map(a => (
          <View key={a.id_aluno} style={styles.tableRow}>
            <Text style={styles.cell}>---</Text>
            <Text style={styles.cell}>{a.nome_turma}</Text>

            <Text style={styles.cellLarge}>{a.nome}</Text>

            <Text style={styles.cellLarge}>{a.faltas}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() =>
                  navigation.navigate("RegistrarFalta", {
                    idAluno: a.id_aluno,
                    nomeAluno: a.nome
                  })
                }
              >
                <Text style={styles.btnText}>Adicionar Falta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#F5F5F5" },
  chatButton: {
    backgroundColor: "#512DA8",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15
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
    marginBottom: 15
  },

  filtrosLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },

  filtroBox: { width: "30%" },

  filtroLabel: { fontWeight: "bold", marginBottom: 4 },

  pickerBox: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 6,
    backgroundColor: "#FFF"
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#E0E0E0",
    borderWidth: 1,
    borderColor: "#999"
  },

  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#CCC",
    backgroundColor: "#FFF"
  },

  cell: {
    width: 60,
    padding: 8,
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#CCC",
    fontSize: 12
  },

  cellLarge: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderColor: "#CCC",
    fontSize: 12
  },

  header: {
    fontWeight: "bold",
    textAlign: "center"
  },

  actions: {
    minWidth: 90,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    gap: 4
  },

  btn: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#777",
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "#EEE",
    alignItems: "center"
  },

  btnText: { fontSize: 11 }
});
