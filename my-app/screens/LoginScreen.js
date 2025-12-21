import React, { useState } from 'react';
import api from './api';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function entrar() {
    if (!login || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/login', {
        email: login,
        senha: senha
      });

      console.log('Login success:', response.data);

      Alert.alert("Sucesso", "Login realizado com sucesso!");
      navigation.navigate("Home", response.data.professor);

    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        Alert.alert("Erro", error.response.data.detail || "Credenciais inválidas");
      } else if (error.request) {
        Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique:\n1. Se o backend está rodando\n2. Se o IP está correto\n3. Se há firewall bloqueando");
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={login}
          onChangeText={setLogin}
          placeholder="seu@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          placeholder="Sua senha"
        />

        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.7 }]}
          onPress={entrar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.link}>Cadastrar docente</Text>
        </TouchableOpacity>

        <Text style={styles.info}>
          Para testar sem backend, clique em "Cadastrar docente" primeiro
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E5F5' // roxo claro igual ao PDF
  },

  box: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 20,
    elevation: 6,
  },

  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: 'bold',
    color: '#512DA8' // roxo escuro
  },

  label: {
    marginTop: 10,
    fontWeight: '700',
    color: '#5E35B1'
  },

  input: {
    borderWidth: 2,
    borderColor: '#9575CD',
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
  },

  btn: {
    backgroundColor: '#673AB7',
    padding: 15,
    borderRadius: 12,
    marginTop: 25,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },

  link: {
    textAlign: 'center',
    color: '#7E57C2',
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 14
  },

  info: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6A1B9A',
    marginTop: 10
  }
});
