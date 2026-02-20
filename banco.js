const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DB_PATH = 'db.json';

const lerBanco = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { usuarios: [], tickets: [] };
    }
};

const salvarBanco = (dados) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(dados, null, 2));
};

app.get('/usuarios', (req, res) => {
    const db = lerBanco();
    res.json(db.usuarios);
});
app.post('/usuarios', (req, res) => {
    const db = lerBanco(); 
    const novoUsuario = req.body;
    db.usuarios.push(novoUsuario);
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
    res.status(201).json(novoUsuario);
});
app.get('/tickets', (req, res) => {
    const db = lerBanco();
    res.json(db.tickets);
});

app.post('/tickets', (req, res) => {
    const db = lerBanco();
    const novoTicket = {
        id: Date.now().toString(),
        ...req.body
    };
    db.tickets.push(novoTicket);
    salvarBanco(db);
    res.status(201).json(novoTicket);
});


// Rota para Atualizar (Finalizar)
app.patch('/tickets/:id', (req, res) => {
    const db = lerBanco();
    const { id } = req.params;
    const { status } = req.body;

    // Procuramos o ticket pelo ID (que vem como string do req.params)
    const index = db.tickets.findIndex(t => t.id === id);
    
    if (index !== -1) {
        db.tickets[index].status = status; 
        salvarBanco(db);
        console.log(`Ticket ${id} finalizado com sucesso.`);
        res.json(db.tickets[index]);
    } else {
        console.log(`Erro: Ticket ${id} não encontrado.`);
        res.status(404).json({ mensagem: "Ticket não encontrado" });
    }
});
app.delete('/tickets/:id', (req, res) => {
    const db = lerBanco();
    const { id } = req.params;
    db.tickets = db.tickets.filter(t => t.id !== id);
    salvarBanco(db);
    res.json({ mensagem: "Ticket removido!" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Para parar o servidor, aperte CTRL + C no terminal`);
});