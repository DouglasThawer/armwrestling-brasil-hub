import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Serviço para envio de e-mails usando Nodemailer
 */
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Inicializar o transportador de e-mail
   */
  initializeTransporter() {
    try {
      // Verificar se as variáveis de e-mail estão configuradas
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('ℹ️ Configurações de e-mail não encontradas. Serviço de e-mail será desabilitado.');
        this.transporter = null;
        return;
      }

      // Configuração para Gmail (pode ser alterada para outros provedores)
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true para 465, false para outras portas
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verificar conexão
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('Erro na configuração do e-mail:', error);
        } else {
          console.log('✅ Servidor de e-mail configurado com sucesso');
        }
      });

    } catch (error) {
      console.error('Erro ao inicializar serviço de e-mail:', error);
    }
  }

  /**
   * Enviar e-mail de boas-vindas para novos usuários
   * @param {string} to - E-mail do destinatário
   * @param {string} firstName - Nome do usuário
   * @param {string} userType - Tipo de usuário
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendWelcomeEmail(to, firstName, userType) {
    try {
      const subject = 'Bem-vindo ao Armwrestling Brasil!';
      
      let htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏆 Armwrestling Brasil</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Olá, ${firstName}!</h2>
            <p style="color: #666; line-height: 1.6;">
              Seja bem-vindo(a) à comunidade do Armwrestling Brasil! 
              Estamos muito felizes em tê-lo(a) conosco.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">📋 Seu Perfil</h3>
              <p style="color: #666; margin: 0;">
                <strong>Tipo de Usuário:</strong> ${this.getUserTypeLabel(userType)}
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Agora você pode:
            </p>
            <ul style="color: #666; line-height: 1.6;">
              ${this.getUserTypeFeatures(userType)}
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 25px; display: inline-block;">
                Acessar Plataforma
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Se você tiver alguma dúvida, não hesite em nos contatar.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Abraços,<br>
              <strong>Equipe Armwrestling Brasil</strong>
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 12px;">
              © 2024 Armwrestling Brasil. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `;

      const result = await this.sendEmail(to, subject, htmlContent);
      return result;

    } catch (error) {
      console.error('Erro ao enviar e-mail de boas-vindas:', error);
      throw new Error('Falha ao enviar e-mail de boas-vindas');
    }
  }

  /**
   * Enviar e-mail de confirmação de equipe
   * @param {string} to - E-mail do destinatário
   * @param {string} teamName - Nome da equipe
   * @param {string} status - Status da aprovação
   * @param {string} reason - Motivo da rejeição (se aplicável)
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendTeamStatusEmail(to, teamName, status, reason = null) {
    try {
      const isApproved = status === 'approved';
      const subject = isApproved 
        ? `✅ Sua equipe "${teamName}" foi aprovada!` 
        : `❌ Sua equipe "${teamName}" precisa de ajustes`;

      let htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏆 Armwrestling Brasil</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Status da Equipe: ${teamName}</h2>
            
            ${isApproved ? `
              <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #155724; margin-top: 0;">🎉 Parabéns! Sua equipe foi aprovada!</h3>
                <p style="color: #155724; margin: 0;">
                  Agora você pode começar a cadastrar atletas e criar eventos.
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                Sua equipe está ativa e visível na plataforma. 
                Os usuários podem agora:
              </p>
              <ul style="color: #666; line-height: 1.6;">
                <li>Ver o perfil da sua equipe</li>
                <li>Cadastrar-se como atletas</li>
                <li>Participar dos seus eventos</li>
                <li>Favoritar sua equipe</li>
              </ul>
            ` : `
              <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #721c24; margin-top: 0;">⚠️ Sua equipe precisa de ajustes</h3>
                <p style="color: #721c24; margin: 0;">
                  <strong>Motivo:</strong> ${reason || 'Informações insuficientes ou incorretas'}
                </p>
              </div>
              
              <p style="color: #666; line-height: 1.6;">
                Para que sua equipe seja aprovada, você precisa:
              </p>
              <ul style="color: #666; line-height: 1.6;">
                <li>Verificar se todas as informações estão corretas</li>
                <li>Completar o perfil com dados válidos</li>
                <li>Fornecer documentação necessária</li>
                <li>Entrar em contato conosco se necessário</li>
              </ul>
            `}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/teams" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 25px; display: inline-block;">
                ${isApproved ? 'Gerenciar Equipe' : 'Revisar Perfil'}
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Se você tiver alguma dúvida, não hesite em nos contatar.
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Abraços,<br>
              <strong>Equipe Armwrestling Brasil</strong>
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 12px;">
              © 2024 Armwrestling Brasil. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `;

      const result = await this.sendEmail(to, subject, htmlContent);
      return result;

    } catch (error) {
      console.error('Erro ao enviar e-mail de status da equipe:', error);
      throw new Error('Falha ao enviar e-mail de status da equipe');
    }
  }

  /**
   * Enviar e-mail de notificação de evento
   * @param {string} to - E-mail do destinatário
   * @param {string} eventTitle - Título do evento
   * @param {string} eventDate - Data do evento
   * @param {string} eventLocation - Local do evento
   * @param {string} notificationType - Tipo de notificação
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendEventNotificationEmail(to, eventTitle, eventDate, eventLocation, notificationType) {
    try {
      const subject = `📅 ${this.getEventNotificationSubject(notificationType)}: ${eventTitle}`;
      
      let htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏆 Armwrestling Brasil</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">${this.getEventNotificationTitle(notificationType)}</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #333; margin-top: 0;">${eventTitle}</h3>
              <p style="color: #666; margin: 5px 0;">
                <strong>📅 Data:</strong> ${eventDate}
              </p>
              <p style="color: #666; margin: 5px 0;">
                <strong>📍 Local:</strong> ${eventLocation}
              </p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              ${this.getEventNotificationMessage(notificationType)}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/events" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 25px; display: inline-block;">
                Ver Evento
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Abraços,<br>
              <strong>Equipe Armwrestling Brasil</strong>
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 12px;">
              © 2024 Armwrestling Brasil. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `;

      const result = await this.sendEmail(to, subject, htmlContent);
      return result;

    } catch (error) {
      console.error('Erro ao enviar e-mail de notificação de evento:', error);
      throw new Error('Falha ao enviar e-mail de notificação de evento');
    }
  }

  /**
   * Enviar e-mail de recuperação de senha
   * @param {string} to - E-mail do destinatário
   * @param {string} resetToken - Token de reset
   * @param {string} firstName - Nome do usuário
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendPasswordResetEmail(to, resetToken, firstName) {
    try {
      const subject = '🔐 Recuperação de Senha - Armwrestling Brasil';
      
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
      
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏆 Armwrestling Brasil</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Olá, ${firstName}!</h2>
            
            <p style="color: #666; line-height: 1.6;">
              Recebemos uma solicitação para redefinir sua senha. 
              Se você não fez essa solicitação, pode ignorar este e-mail.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px dashed #667eea;">
              <p style="color: #666; margin: 0; text-align: center;">
                <strong>⚠️ IMPORTANTE:</strong><br>
                Este link expira em 1 hora por motivos de segurança.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 12px 30px; text-decoration: none; 
                        border-radius: 25px; display: inline-block;">
                Redefinir Senha
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              Se o botão não funcionar, copie e cole este link no seu navegador:
            </p>
            <p style="color: #667eea; word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>
            
            <p style="color: #666; line-height: 1.6;">
              Abraços,<br>
              <strong>Equipe Armwrestling Brasil</strong>
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 12px;">
              © 2024 Armwrestling Brasil. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `;

      const result = await this.sendEmail(to, subject, htmlContent);
      return result;

    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação de senha:', error);
      throw new Error('Falha ao enviar e-mail de recuperação de senha');
    }
  }

  /**
   * Enviar e-mail genérico
   * @param {string} to - E-mail do destinatário
   * @param {string} subject - Assunto do e-mail
   * @param {string} htmlContent - Conteúdo HTML do e-mail
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendEmail(to, subject, htmlContent) {
    try {
      if (!this.transporter) {
        throw new Error('Serviço de e-mail não configurado');
      }

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: to,
        subject: subject,
        html: htmlContent
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ E-mail enviado com sucesso:', {
        to: to,
        subject: subject,
        messageId: info.messageId
      });

      return {
        success: true,
        messageId: info.messageId,
        to: to,
        subject: subject
      };

    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error(`Falha ao enviar e-mail: ${error.message}`);
    }
  }

  /**
   * Obter label do tipo de usuário
   * @param {string} userType - Tipo de usuário
   * @returns {string} - Label formatado
   */
  getUserTypeLabel(userType) {
    const labels = {
      'admin': 'Administrador',
      'team': 'Equipe',
      'visitor': 'Visitante'
    };
    return labels[userType] || userType;
  }

  /**
   * Obter funcionalidades baseadas no tipo de usuário
   * @param {string} userType - Tipo de usuário
   * @returns {string} - Lista HTML de funcionalidades
   */
  getUserTypeFeatures(userType) {
    if (userType === 'team') {
      return `
        <li>Cadastrar e gerenciar sua equipe</li>
        <li>Registrar atletas</li>
        <li>Criar e organizar eventos</li>
        <li>Acessar relatórios e estatísticas</li>
      `;
    } else if (userType === 'visitor') {
      return `
        <li>Visualizar equipes e atletas</li>
        <li>Participar de eventos</li>
        <li>Favoritar equipes e atletas</li>
        <li>Receber notificações sobre eventos</li>
      `;
    } else {
      return `
        <li>Acessar todas as funcionalidades da plataforma</li>
        <li>Gerenciar usuários e conteúdo</li>
        <li>Visualizar relatórios administrativos</li>
      `;
    }
  }

  /**
   * Obter assunto da notificação de evento
   * @param {string} notificationType - Tipo de notificação
   * @returns {string} - Assunto formatado
   */
  getEventNotificationSubject(notificationType) {
    const subjects = {
      'created': 'Novo Evento Criado',
      'updated': 'Evento Atualizado',
      'reminder': 'Lembrete de Evento',
      'cancelled': 'Evento Cancelado'
    };
    return subjects[notificationType] || 'Notificação de Evento';
  }

  /**
   * Obter título da notificação de evento
   * @param {string} notificationType - Tipo de notificação
   * @returns {string} - Título formatado
   */
  getEventNotificationTitle(notificationType) {
    const titles = {
      'created': '🎉 Novo evento disponível!',
      'updated': '📝 Evento atualizado',
      'reminder': '⏰ Lembrete de evento',
      'cancelled': '❌ Evento cancelado'
    };
    return titles[notificationType] || 'Notificação de Evento';
  }

  /**
   * Obter mensagem da notificação de evento
   * @param {string} notificationType - Tipo de notificação
   * @returns {string} - Mensagem formatada
   */
  getEventNotificationMessage(notificationType) {
    const messages = {
      'created': 'Um novo evento foi criado e está disponível para inscrições. Não perca a oportunidade de participar!',
      'updated': 'As informações deste evento foram atualizadas. Verifique as mudanças e confirme sua participação.',
      'reminder': 'Este evento acontecerá em breve. Confirme sua presença e prepare-se para uma competição incrível!',
      'cancelled': 'Infelizmente este evento foi cancelado. Entraremos em contato em breve com mais informações.'
    };
    return messages[notificationType] || 'Você recebeu uma notificação sobre um evento.';
  }
}

export default new EmailService();
