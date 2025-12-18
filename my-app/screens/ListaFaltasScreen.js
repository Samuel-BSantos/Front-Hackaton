import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const alunos = [
  { id: 1, nome: "Adriana Monteiro" },
  { id: 2, nome: "Bruno Siqueira" },
  { id: 3, nome: "Daniel Arantes" },
];

// MOCK das faltas
const faltasMock = {
  1: [
    { id: 1, dia: "2025-11-10", qtd: 1 },
    { id: 2, dia: "2025-11-20", qtd: 2 },
    { id: 3, dia: "2025-12-02", qtd: 1 },
  ],
  2: [
    { id: 1, dia: "2025-10-01", qtd: 1 },
    { id: 2, dia: "2025-10-15", qtd: 1 },
  ],
  3: [
    { id: 1, dia: "2025-09-10", qtd: 3 }
  ]
};

export default function ListaFaltasScreen({ route, navigation }) {
  const { id } = route.params;

  const aluno = alunos.find(a => a.id === id);
  const faltas = faltasMock[id] || [];

  const totalFaltas = faltas.reduce((sum, f) => sum + f.qtd, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faltas do Aluno</Text>

      <Text style={styles.alunoNome}>
        {aluno ? aluno.nome : "Aluno não encontrado"}
      </Text>

      <Text style={styles.totalFaltas}>
        Total de faltas: {totalFaltas}
      </Text>

      {/* CABEÇALHO DA TABELA */}
      <View style={styles.tableHeader}>
        <Text style={[styles.cellLarge, styles.header]}>Data</Text>
        <Text style={[styles.cell, styles.header]}>Qtd</Text>
        <Text style={[styles.cellLarge, styles.header]}>Ações</Text>
      </View>

      <ScrollView>
        {faltas.length === 0 ? (
          <Text style={styles.noData}>Nenhuma falta registrada.</Text>
        ) : (
          faltas.map(f => (
            <View key={f.id} style={styles.tableRow}>
              <Text style={styles.cellLarge}>
                {new Date(f.dia).toLocaleDateString("pt-BR")}
              </Text>

              <Text style={styles.cell}>{f.qtd}</Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() =>
                    navigation.navigate("EditarFalta", {
                      id: id,
                      faltaId: f.id,
                      qtd: f.qtd,
                      dia: f.dia
                    })
                  }
                >
                  <Text style={styles.btnText}>Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F5F5F5" },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5
  },

  alunoNome: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5
  },

  totalFaltas: {
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20
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
    fontSize: 12,
    textAlign: "center"
  },

  header: {
    fontWeight: "bold"
  },

  actions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  btn: {
    borderWidth: 1,
    borderColor: "#777",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: "#EEE"
  },

  btnText: {
    fontSize: 12
  },

  noData: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777"
  }
});
