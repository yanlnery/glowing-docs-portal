import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, UserPlus, LogIn, MessageCircle } from 'lucide-react';

const CheckoutAuthPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-muted/30 py-12 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Quase lá!</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Para finalizar sua compra e ser redirecionado ao nosso WhatsApp, 
            precisamos que você crie uma conta ou faça login.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">É rapidinho!</span> Leva menos de 1 minuto para criar sua conta.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full h-12 text-base" size="lg">
              <Link to="/signup" state={{ fromCheckout: true }}>
                <UserPlus className="mr-2 h-5 w-5" />
                Criar minha conta
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full h-12 text-base" size="lg">
              <Link to="/login" state={{ fromCheckout: true }}>
                <LogIn className="mr-2 h-5 w-5" />
                Já tenho conta, fazer login
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-3 pt-4 border-t">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Após o cadastro, você será redirecionado ao <span className="font-medium text-foreground">WhatsApp</span> para finalizarmos seu atendimento.
            </p>
          </div>
          
          <div className="text-center pt-2">
            <Link to="/carrinho" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Voltar ao carrinho
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutAuthPage;
