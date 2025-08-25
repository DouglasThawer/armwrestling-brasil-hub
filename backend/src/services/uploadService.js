import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Inicializar Firebase Admin SDK (opcional para desenvolvimento)
let bucket = null;
let firebaseInitialized = false;

try {
  // Verificar se as variáveis do Firebase estão configuradas
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
      });
    }
    bucket = admin.storage().bucket();
    firebaseInitialized = true;
    console.log('✅ Firebase Admin SDK inicializado com sucesso');
  } else {
    console.log('ℹ️ Firebase não configurado. Upload de arquivos será desabilitado.');
  }
} catch (error) {
  console.error('⚠️ Erro ao inicializar Firebase Admin:', error);
  console.log('ℹ️ Upload de arquivos será desabilitado. Configure as variáveis do Firebase para habilitar.');
}

/**
 * Serviço para upload de arquivos para o Firebase Storage
 */
class UploadService {
  /**
   * Upload de imagem
   * @param {Buffer} fileBuffer - Buffer do arquivo
   * @param {string} originalName - Nome original do arquivo
   * @param {string} folder - Pasta de destino (ex: 'teams', 'athletes', 'events')
   * @param {string} userId - ID do usuário que está fazendo upload
   * @returns {Promise<Object>} - URL e metadados do arquivo
   */
  async uploadImage(fileBuffer, originalName, folder, userId) {
    try {
      // Verificar se Firebase está configurado e inicializado
      if (!firebaseInitialized || !bucket) {
        throw new Error('Firebase não está configurado ou inicializado. Configure as variáveis de ambiente FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY e FIREBASE_CLIENT_EMAIL.');
      }

      // Validar tipo de arquivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const fileExtension = path.extname(originalName).toLowerCase();
      const mimeType = this.getMimeType(fileExtension);
      
      if (!allowedTypes.includes(mimeType)) {
        throw new Error('Tipo de arquivo não suportado. Use apenas JPEG, PNG ou WebP.');
      }

      // Validar tamanho (máximo 5MB)
      if (fileBuffer.length > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 5MB');
      }

      // Gerar nome único para o arquivo
      const fileName = `${folder}/${userId}/${uuidv4()}${fileExtension}`;
      
      // Upload para Firebase Storage
      const file = bucket.file(fileName);
      
      await file.save(fileBuffer, {
        metadata: {
          contentType: mimeType,
          metadata: {
            originalName,
            uploadedBy: userId,
            uploadedAt: new Date().toISOString(),
            folder
          }
        }
      });

      // Tornar arquivo público
      await file.makePublic();

      // Gerar URL pública
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return {
        success: true,
        url: publicUrl,
        fileName,
        originalName,
        mimeType,
        size: fileBuffer.length,
        folder,
        uploadedBy: userId
      };

    } catch (error) {
      console.error('Erro no upload de imagem:', error);
      throw new Error(`Falha no upload: ${error.message}`);
    }
  }

  /**
   * Upload de vídeo
   * @param {Buffer} fileBuffer - Buffer do arquivo
   * @param {string} originalName - Nome original do arquivo
   * @param {string} folder - Pasta de destino
   * @param {string} userId - ID do usuário que está fazendo upload
   * @returns {Promise<Object>} - URL e metadados do arquivo
   */
  async uploadVideo(fileBuffer, originalName, folder, userId) {
    try {
      // Validar tipo de arquivo
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
      const fileExtension = path.extname(originalName).toLowerCase();
      const mimeType = this.getMimeType(fileExtension);
      
      if (!allowedTypes.includes(mimeType)) {
        throw new Error('Tipo de arquivo não suportado. Use apenas MP4, AVI, MOV ou WMV.');
      }

      // Validar tamanho (máximo 100MB)
      if (fileBuffer.length > 100 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 100MB');
      }

      // Gerar nome único para o arquivo
      const fileName = `${folder}/${userId}/${uuidv4()}${fileExtension}`;
      
      // Upload para Firebase Storage
      const file = bucket.file(fileName);
      
      await file.save(fileBuffer, {
        metadata: {
          contentType: mimeType,
          metadata: {
            originalName,
            uploadedBy: userId,
            uploadedAt: new Date().toISOString(),
            folder
          }
        }
      });

      // Tornar arquivo público
      await file.makePublic();

      // Gerar URL pública
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return {
        success: true,
        url: publicUrl,
        fileName,
        originalName,
        mimeType,
        size: fileBuffer.length,
        folder,
        uploadedBy: userId
      };

    } catch (error) {
      console.error('Erro no upload de vídeo:', error);
      throw new Error(`Falha no upload: ${error.message}`);
    }
  }

  /**
   * Upload de arquivo genérico (documentos, etc.)
   * @param {Buffer} fileBuffer - Buffer do arquivo
   * @param {string} originalName - Nome original do arquivo
   * @param {string} folder - Pasta de destino
   * @param {string} userId - ID do usuário que está fazendo upload
   * @returns {Promise<Object>} - URL e metadados do arquivo
   */
  async uploadFile(fileBuffer, originalName, folder, userId) {
    try {
      // Validar tamanho (máximo 10MB)
      if (fileBuffer.length > 10 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Tamanho máximo: 10MB');
      }

      const fileExtension = path.extname(originalName).toLowerCase();
      const mimeType = this.getMimeType(fileExtension);
      
      // Gerar nome único para o arquivo
      const fileName = `${folder}/${userId}/${uuidv4()}${fileExtension}`;
      
      // Upload para Firebase Storage
      const file = bucket.file(fileName);
      
      await file.save(fileBuffer, {
        metadata: {
          contentType: mimeType,
          metadata: {
            originalName,
            uploadedBy: userId,
            uploadedAt: new Date().toISOString(),
            folder
          }
        }
      });

      // Tornar arquivo público
      await file.makePublic();

      // Gerar URL pública
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return {
        success: true,
        url: publicUrl,
        fileName,
        originalName,
        mimeType,
        size: fileBuffer.length,
        folder,
        uploadedBy: userId
      };

    } catch (error) {
      console.error('Erro no upload de arquivo:', error);
      throw new Error(`Falha no upload: ${error.message}`);
    }
  }

  /**
   * Deletar arquivo
   * @param {string} fileName - Nome do arquivo no Firebase Storage
   * @returns {Promise<boolean>} - Sucesso da operação
   */
  async deleteFile(fileName) {
    try {
      const file = bucket.file(fileName);
      await file.delete();
      return true;
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      return false;
    }
  }

  /**
   * Obter metadados do arquivo
   * @param {string} fileName - Nome do arquivo no Firebase Storage
   * @returns {Promise<Object>} - Metadados do arquivo
   */
  async getFileMetadata(fileName) {
    try {
      const file = bucket.file(fileName);
      const [metadata] = await file.getMetadata();
      return metadata;
    } catch (error) {
      console.error('Erro ao obter metadados:', error);
      throw new Error('Arquivo não encontrado');
    }
  }

  /**
   * Listar arquivos de uma pasta
   * @param {string} folder - Pasta para listar
   * @param {string} userId - ID do usuário (opcional, para filtrar por usuário)
   * @returns {Promise<Array>} - Lista de arquivos
   */
  async listFiles(folder, userId = null) {
    try {
      let prefix = folder;
      if (userId) {
        prefix = `${folder}/${userId}`;
      }

      const [files] = await bucket.getFiles({ prefix });
      
      return files.map(file => ({
        name: file.name,
        size: file.metadata.size,
        contentType: file.metadata.contentType,
        createdAt: file.metadata.timeCreated,
        updatedAt: file.metadata.updated,
        url: `https://storage.googleapis.com/${bucket.name}/${file.name}`
      }));

    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      throw new Error('Falha ao listar arquivos');
    }
  }

  /**
   * Gerar URL assinada para acesso temporário
   * @param {string} fileName - Nome do arquivo
   * @param {number} expirationMinutes - Tempo de expiração em minutos
   * @returns {Promise<string>} - URL assinada
   */
  async generateSignedUrl(fileName, expirationMinutes = 60) {
    try {
      const file = bucket.file(fileName);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expirationMinutes * 60 * 1000
      });
      return url;
    } catch (error) {
      console.error('Erro ao gerar URL assinada:', error);
      throw new Error('Falha ao gerar URL assinada');
    }
  }

  /**
   * Obter MIME type baseado na extensão do arquivo
   * @param {string} extension - Extensão do arquivo
   * @returns {string} - MIME type
   */
  getMimeType(extension) {
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.mp4': 'video/mp4',
      '.avi': 'video/avi',
      '.mov': 'video/mov',
      '.wmv': 'video/wmv',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain'
    };

    return mimeTypes[extension] || 'application/octet-stream';
  }

  /**
   * Validar arquivo antes do upload
   * @param {Object} file - Objeto do arquivo
   * @param {Array} allowedTypes - Tipos MIME permitidos
   * @param {number} maxSize - Tamanho máximo em bytes
   * @returns {Object} - Resultado da validação
   */
  validateFile(file, allowedTypes, maxSize) {
    const errors = [];

    if (!file) {
      errors.push('Nenhum arquivo foi enviado');
      return { isValid: false, errors };
    }

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push(`Tipo de arquivo não suportado. Tipos permitidos: ${allowedTypes.join(', ')}`);
    }

    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      errors.push(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new UploadService();
