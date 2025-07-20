// 1. Importar com sintaxe de módulo ES6 e tipos do Express
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// 2. Inicializar o Express
const app = express();
const port = 3000;

// 3. Configurar Middlewares
app.use(cors());
app.use(express.json());

// 4. Conectar ao MongoDB Atlas
const mongoURI = 'mongodb+srv://NicolasRaf:eK7KXxRoJeKD4XWp@cluster0.sdd5lya.mongodb.net/meuBlogDB?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB conectado com sucesso com TypeScript!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// 5. Criar a INTERFACE do Post (aqui está o poder do TypeScript)
//    Isso define o "contrato" do nosso documento para o TypeScript.

interface IComentario extends mongoose.Document {
    autor: string;
    texto: string;
    data: Date;
}

interface IPost extends mongoose.Document {
  id_secao: string;
  titulo: string;
  conteudoHTML: string;
  autor: string;
  data: string;
  comentarios: IComentario[];
}

const comentarioSchema = new mongoose.Schema({
    autor: { type: String, required: true },
    texto: { type: String, required: true },
    data: { type: Date, default: Date.now }
});

// 6. Criar o Schema do Mongoose (estrutura para o MongoDB)
const postSchema = new mongoose.Schema({
  id_secao: { type: String, required: true },
  titulo: { type: String, required: true },
  conteudoHTML: { type: String, required: true },
  autor: { type: String, default: 'Ely Miranda' },
  data: { type: String, default: '08/04/2025' },
  comentarios: [comentarioSchema]
});

const Post = mongoose.model<IPost>('Post', postSchema);

// 7. Criar a Rota da API com Tipos
//    Note como `req` e `res` agora têm tipos (Request, Response).
//    Isso nos dá autocompletar e segurança!
app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({});
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar postagens', error: err });
    console.log(err);
  }
});

app.post('/api/posts', async (req: Request, res: Response) => {
    try {
        // O corpo da requisição é tipado automaticamente como `any`,
        // mas sabemos o que esperar dele.
        const novoPost = new Post({
            id_secao: req.body.id_secao,
            titulo: req.body.titulo,
            conteudoHTML: req.body.conteudoHTML,
        });
        await novoPost.save();
        res.status(201).json(novoPost);
    } catch(err) {
        res.status(400).json({ message: "Erro ao criar postagem", error: err });
    }
});


app.post('/api/posts/:postId/comments', async (req: Request, res: Response) => {
    try {
        const post: IPost | null = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado' });
        }

        const novoComentario = {
            autor: req.body.autor,
            texto: req.body.texto
        };

        post.comentarios.push(novoComentario as any); // Adiciona o comentário ao array
        await post.save(); // Salva o post com o novo comentário

        res.status(201).json(post);
    } catch (err) {
        console.error("Erro ao adicionar comentário:", err);
        res.status(500).json({ message: 'Erro ao adicionar comentário', error: err });
    }
});

app.use((error: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error("--- ERRO GLOBAL CAPTURADO ---");
  console.error(error); // Isso vai nos mostrar o erro real!
  
  if (res.headersSent) {
    return next(error);
  }
  
  res.status(500).json({ 
    message: "Ocorreu um erro interno no servidor.",
    errorMessage: error.message // Inclui a mensagem do erro na resposta
  });
});


// 8. Iniciar o servidor
app.listen(port, () => {
    console.log('Servidor iniciado com sucesso!');
    console.log(`Servidor TypeScript rodando em http://localhost:${port}`);
});