import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const alunos = [
  { id: 1, curso: "ADS", serie: "4°", turma: "B", nome: "Adriana Monteiro", presenca: 99 },
  { id: 2, curso: "TDS", serie: "1°", turma: "A", nome: "Bruno Siqueira", presenca: 79 },
  { id: 3, curso: "TDS", serie: "1°", turma: "B", nome: "Carla Fernandes", presenca: 82 },
  { id: 4, curso: "ADS", serie: "2°", turma: "B", nome: "Daniel Arantes", presenca: 55 },
  { id: 5, curso: "ADS", serie: "3°", turma: "A", nome: "Eduardo Paiva", presenca: 90 },
  { id: 6, curso: "ADS", serie: "1°", turma: "A", nome: "Fernanda Ribeiro", presenca: 96 },
  { id: 7, curso: "TDS", serie: "2°", turma: "A", nome: "Gabriel Tavares", presenca: 100 },
  { id: 8, curso: "ADS", serie: "1°", turma: "B", nome: "Helena Moura", presenca: 98 },
  { id: 9, curso: "TDS", serie: "3°", turma: "B", nome: "Igor Almeida", presenca: 85 },
  { id: 10, curso: "TDS", serie: "3°", turma: "B", nome: "Juliana Castro", presenca: 80 },
  { id: 11, curso: "TDS", serie: "2°", turma: "A", nome: "Karen Duarte", presenca: 65 },
  { id: 12, curso: "TDS", serie: "3°", turma: "B", nome: "Leonardo Pimentel", presenca: 70 },
  { id: 13, curso: "TDS", serie: "3°", turma: "A", nome: "Mariana Silveira", presenca: 25 },
  { id: 14, curso: "ADS", serie: "2°", turma: "A", nome: "Nicolas Figueiredo", presenca: 91 },
  { id: 15, curso: "TDS", serie: "3°", turma: "B", nome: "Otávia Cardoso", presenca: 85 },
  { id: 16, curso: "TDS", serie: "2°", turma: "B", nome: "Paulo Nascimento", presenca: 80 },
];

export default function HomeScreen({ navigation }) {
  const [curso, setCurso] = useState("");
  const [serie, setSerie] = useState("");
  const [turma, setTurma] = useState("");

  const filtrados = alunos.filter(a =>
    (curso === "" || a.curso === curso) &&
    (serie === "" || a.serie === serie) &&
    (turma === "" || a.turma === turma)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alunos</Text>
      <TouchableOpacity
      style={styles.chatButton}
      onPress={() => navigation.navigate("ChatAI")}
      >
        <Text style={styles.chatButtonText}>Abrir Chat IA</Text>
      </TouchableOpacity>


      {/* FILTROS */}
      <View style={styles.filtrosLinha}>
        <View style={styles.filtroBox}>
          <Text style={styles.filtroLabel}>Curso</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={curso} onValueChange={setCurso}>
              <Picker.Item label="" value="" />
              <Picker.Item label="ADS" value="ADS" />
              <Picker.Item label="TDS" value="TDS" />
            </Picker>
          </View>
        </View>

        <View style={styles.filtroBox}>
          <Text style={styles.filtroLabel}>Série</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={serie} onValueChange={setSerie}>
              <Picker.Item label="" value="" />
              <Picker.Item label="1°" value="1°" />
              <Picker.Item label="2°" value="2°" />
              <Picker.Item label="3°" value="3°" />
              <Picker.Item label="4°" value="4°" />
            </Picker>
          </View>
        </View>

        <View style={styles.filtroBox}>
          <Text style={styles.filtroLabel}>Turma</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={turma} onValueChange={setTurma}>
              <Picker.Item label="" value="" />
              <Picker.Item label="A" value="A" />
              <Picker.Item label="B" value="B" />
            </Picker>
          </View>
        </View>
      </View>

      {/* TABELA */}
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.header]}>Curso</Text>
        <Text style={[styles.cell, styles.header]}>Série</Text>
        <Text style={[styles.cell, styles.header]}>Turma</Text>
        <Text style={[styles.cellLarge, styles.header]}>Nome</Text>
        <Text style={[styles.cellLarge, styles.header]}>Presença</Text>
        <Text style={[styles.cellLarge, styles.header]}>Ações</Text>
      </View>

      <ScrollView>
        {filtrados.map(a => (
          <View key={a.id} style={styles.tableRow}>
            <Text style={styles.cell}>{a.curso}</Text>
            <Text style={styles.cell}>{a.serie}</Text>
            <Text style={styles.cell}>{a.turma}</Text>

            <Text style={styles.cellLarge}>{a.nome}</Text>

            <Text style={styles.cellLarge}>{a.presenca}%</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate("RegistrarFalta", { id: a.id })}
              >
                <Text style={styles.btnText}>Registrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate("ListaFaltas", { id: a.id })}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
  },

  btn: {
    borderWidth: 1,
    borderColor: "#777",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#EEE"
  },

  btnText: { fontSize: 11 }
});
