import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const { user, signOut, isAdmin } = useAuth();

  console.log('Admin Page: Renderizando...');
  console.log('Admin Page: User:', user);
  console.log('Admin Page: isAdmin():', isAdmin());

  const handleLogout = async () => {
    console.log('Admin Page: Fazendo logout...');
    await signOut();
  };

  // Página de teste simples
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Simples */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🎯 PAINEL ADMINISTRATIVO
            </h1>
            <p className="text-lg text-gray-600">
              Bem-vindo ao painel de controle do sistema
            </p>
          </div>

          {/* Card de Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                📊 Status do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">✅</div>
                  <div className="text-lg font-semibold text-green-800">Sistema Online</div>
                  <div className="text-sm text-green-600">Funcionando perfeitamente</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">👤</div>
                  <div className="text-lg font-semibold text-blue-800">Usuário Logado</div>
                  <div className="text-sm text-blue-600">{user?.email || 'N/A'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Usuário */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">
                👤 Informações do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome:</label>
                    <p className="text-lg font-semibold">{user?.first_name} {user?.last_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
                    <p className="text-lg font-semibold">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo:</label>
                    <p className="text-lg font-semibold text-blue-600">{user?.user_type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefone:</label>
                    <p className="text-lg font-semibold">{user?.phone || 'Não informado'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                🚀 Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="w-full h-16 text-lg" variant="outline">
                  👥 Gerenciar Usuários
                </Button>
                <Button className="w-full h-16 text-lg" variant="outline">
                  🏆 Gerenciar Equipes
                </Button>
                <Button className="w-full h-16 text-lg" variant="outline">
                  ⭐ Gerenciar Patrocinadores
                </Button>
              </div>
              
              {/* Botão de Logout */}
              <div className="mt-6 text-center">
                <Button 
                  onClick={handleLogout} 
                  variant="destructive" 
                  size="lg"
                  className="px-8"
                >
                  🚪 Sair do Sistema
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Debug Info */}
          <div className="mt-8 p-4 bg-gray-800 text-white rounded-lg">
            <h3 className="text-lg font-semibold mb-2">🐛 Debug Info:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify({
                user: user ? {
                  id: user.id,
                  email: user.email,
                  user_type: user.user_type,
                  first_name: user.first_name,
                  last_name: user.last_name
                } : null,
                isAdmin: isAdmin(),
                timestamp: new Date().toISOString()
              }, null, 2)}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;
