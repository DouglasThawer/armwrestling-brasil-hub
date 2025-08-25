import express from 'express';
import multer from 'multer';
import { authenticateToken, requireTeamOrAdmin } from '../middleware/auth.js';
import uploadService from '../services/uploadService.js';

const router = express.Router();

// Configuração do Multer para processar arquivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB máximo
    files: 5 // Máximo 5 arquivos por vez
  }
});

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload de imagem
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de imagem
 *               folder:
 *                 type: string
 *                 description: Pasta de destino (teams, athletes, events, posts)
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/image', [
  authenticateToken,
  requireTeamOrAdmin,
  upload.single('image')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma imagem foi enviada'
      });
    }

    const { folder } = req.body;
    const allowedFolders = ['teams', 'athletes', 'events', 'posts', 'sponsors'];

    if (!folder || !allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Pasta inválida. Use: teams, athletes, events, posts ou sponsors'
      });
    }

    // Validar arquivo
    const validation = uploadService.validateFile(
      req.file, 
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'], 
      5 * 1024 * 1024 // 5MB
    );

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Arquivo inválido',
        errors: validation.errors
      });
    }

    // Fazer upload
    const result = await uploadService.uploadImage(
      req.file.buffer,
      req.file.originalname,
      folder,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Imagem enviada com sucesso',
      data: result
    });

  } catch (error) {
    console.error('Erro no upload de imagem:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/upload/video:
 *   post:
 *     summary: Upload de vídeo
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de vídeo
 *               folder:
 *                 type: string
 *                 description: Pasta de destino
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/video', [
  authenticateToken,
  requireTeamOrAdmin,
  upload.single('video')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum vídeo foi enviado'
      });
    }

    const { folder } = req.body;
    const allowedFolders = ['teams', 'athletes', 'events', 'posts'];

    if (!folder || !allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Pasta inválida. Use: teams, athletes, events ou posts'
      });
    }

    // Validar arquivo
    const validation = uploadService.validateFile(
      req.file, 
      ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'], 
      100 * 1024 * 1024 // 100MB
    );

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Arquivo inválido',
        errors: validation.errors
      });
    }

    // Fazer upload
    const result = await uploadService.uploadVideo(
      req.file.buffer,
      req.file.originalname,
      folder,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Vídeo enviado com sucesso',
      data: result
    });

  } catch (error) {
    console.error('Erro no upload de vídeo:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/upload/file:
 *   post:
 *     summary: Upload de arquivo genérico
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo genérico
 *               folder:
 *                 type: string
 *                 description: Pasta de destino
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/file', [
  authenticateToken,
  requireTeamOrAdmin,
  upload.single('file')
], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo foi enviado'
      });
    }

    const { folder } = req.body;
    const allowedFolders = ['documents', 'contracts', 'results'];

    if (!folder || !allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Pasta inválida. Use: documents, contracts ou results'
      });
    }

    // Validar arquivo
    const validation = uploadService.validateFile(
      req.file, 
      [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png'
      ], 
      10 * 1024 * 1024 // 10MB
    );

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Arquivo inválido',
        errors: validation.errors
      });
    }

    // Fazer upload
    const result = await uploadService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      folder,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Arquivo enviado com sucesso',
      data: result
    });

  } catch (error) {
    console.error('Erro no upload de arquivo:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Upload de múltiplos arquivos
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Múltiplos arquivos
 *               folder:
 *                 type: string
 *                 description: Pasta de destino
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *       400:
 *         description: Erro de validação
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/multiple', [
  authenticateToken,
  requireTeamOrAdmin,
  upload.array('files', 5) // Máximo 5 arquivos
], async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum arquivo foi enviado'
      });
    }

    const { folder } = req.body;
    const allowedFolders = ['teams', 'athletes', 'events', 'posts', 'gallery'];

    if (!folder || !allowedFolders.includes(folder)) {
      return res.status(400).json({
        success: false,
        message: 'Pasta inválida. Use: teams, athletes, events, posts ou gallery'
      });
    }

    const results = [];
    const errors = [];

    // Processar cada arquivo
    for (const file of req.files) {
      try {
        let result;
        
        if (file.mimetype.startsWith('image/')) {
          result = await uploadService.uploadImage(
            file.buffer,
            file.originalname,
            folder,
            req.user.id
          );
        } else if (file.mimetype.startsWith('video/')) {
          result = await uploadService.uploadVideo(
            file.buffer,
            file.originalname,
            folder,
            req.user.id
          );
        } else {
          result = await uploadService.uploadFile(
            file.buffer,
            file.originalname,
            folder,
            req.user.id
          );
        }

        results.push(result);
      } catch (error) {
        errors.push({
          file: file.originalname,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: `${results.length} arquivo(s) enviado(s) com sucesso`,
      data: {
        successful: results,
        failed: errors
      }
    });

  } catch (error) {
    console.error('Erro no upload múltiplo:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/upload/files/{folder}:
 *   get:
 *     summary: Listar arquivos de uma pasta
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *         description: Pasta para listar
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: ID do usuário para filtrar (opcional)
 *     responses:
 *       200:
 *         description: Lista de arquivos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/files/:folder', authenticateToken, async (req, res) => {
  try {
    const { folder } = req.params;
    const { user_id } = req.query;

    const files = await uploadService.listFiles(folder, user_id);

    res.json({
      success: true,
      data: files
    });

  } catch (error) {
    console.error('Erro ao listar arquivos:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/upload/delete/{fileName}:
 *   delete:
 *     summary: Deletar arquivo
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do arquivo no Firebase Storage
 *     responses:
 *       200:
 *         description: Arquivo deletado com sucesso
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/delete/:fileName(*)', authenticateToken, async (req, res) => {
  try {
    const { fileName } = req.params;

    // Verificar se o usuário tem permissão para deletar o arquivo
    // (opcional: verificar se o arquivo pertence ao usuário)
    const metadata = await uploadService.getFileMetadata(fileName);
    
    if (metadata.metadata?.uploadedBy !== req.user.id && req.user.user_type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para deletar este arquivo'
      });
    }

    const deleted = await uploadService.deleteFile(fileName);

    if (deleted) {
      res.json({
        success: true,
        message: 'Arquivo deletado com sucesso'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Falha ao deletar arquivo'
      });
    }

  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/upload/signed-url/{fileName}:
 *   get:
 *     summary: Gerar URL assinada para acesso temporário
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome do arquivo no Firebase Storage
 *       - in: query
 *         name: expiration
 *         schema:
 *           type: integer
 *           default: 60
 *         description: Tempo de expiração em minutos
 *     responses:
 *       200:
 *         description: URL assinada gerada
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/signed-url/:fileName(*)', authenticateToken, async (req, res) => {
  try {
    const { fileName } = req.params;
    const { expiration = 60 } = req.query;

    const signedUrl = await uploadService.generateSignedUrl(fileName, parseInt(expiration));

    res.json({
      success: true,
      data: {
        signedUrl,
        expiration: parseInt(expiration),
        fileName
      }
    });

  } catch (error) {
    console.error('Erro ao gerar URL assinada:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
});

export default router;
