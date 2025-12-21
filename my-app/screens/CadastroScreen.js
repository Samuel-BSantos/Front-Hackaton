import React, { useState } from 'react';
import api from './api';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';



export default function CadastroScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    nome_materia: "",
    nome_turma: ""
  });
  const [loading, setLoading] = useState(false);


  function alterar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  async function cadastrar() {
    if (!form.nome || !form.email || !form.senha || !form.nome_materia || !form.nome_turma) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/cadastro', form);

      Alert.alert("Sucesso", response.data.mensagem);
      navigation.navigate("Login");

    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.alert("Erro no cadastro", error.response.data.detail || "Verifique os dados.");
      } else if (error.request) {
        Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique o IP e se o backend está rodando.");
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  }



  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Cadastrar Docente</Text>

        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: João Silva"
          value={form.nome}
          onChangeText={(v) => alterar("nome", v)}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: joao@escola.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(v) => alterar("email", v)}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={form.senha}
          onChangeText={(v) => alterar("senha", v)}
        />

        <Text style={styles.label}>Matéria</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Matemática"
          value={form.nome_materia}
          onChangeText={(v) => alterar("nome_materia", v)}
        />

        <Text style={styles.label}>Turma</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 3º Ano A"
          value={form.nome_turma}
          onChangeText={(v) => alterar("nome_turma", v)}
        />

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={cadastrar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Cadastrar</Text>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F3E5F5'
  },

  box: {
    margin: 20,
    padding: 28,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 6
  },

  title: {
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 25,
    color: '#512DA8',
    fontWeight: 'bold'
  },

  label: {
    fontWeight: '700',
    color: '#5E35B1'
  },

  input: {
    borderWidth: 2,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#9575CD'
  },

  btn: {
    backgroundColor: '#673AB7',
    padding: 15,
    borderRadius: 12
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  }
});
