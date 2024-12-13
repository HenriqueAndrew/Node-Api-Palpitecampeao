const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
const port = 3000;

// Configuração do Swagger
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API de Partidas de Futebol',
        version: '1.0.0',
        description: 'API para consultar partidas de times.',
    },
    servers: [
        {
            url: `http://localhost:${port}`,
            description: 'Servidor local',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

// Dados simulados
const times = [
    { time_id: 1, nome_popular: 'Palmeiras', sigla: 'PAL', escudo: 'https://logodownload.org/wp-content/uploads/2015/05/palmeiras-logo-0.png' },
    { time_id: 2, nome_popular: 'Corinthians', sigla: 'COR', escudo: 'https://logodownload.org/wp-content/uploads/2016/11/corinthians-logo-0.png' },
    { time_id: 3, nome_popular: 'São Paulo', sigla: 'SPO', escudo: 'https://logodownload.org/wp-content/uploads/2016/09/sao-paulo-logo-escudo.png' },
    { time_id: 4, nome_popular: 'Santos', sigla: 'SAN', escudo: 'https://logodownload.org/wp-content/uploads/2017/02/santos-logo-escudo.png' },
];

const partidas = [
    {
        partida_id: 1,
        time_mandante: times[0],
        time_visitante: times[1],
        placar_mandante: 4,
        placar_visitante: 0,
        data_realizacao: '2024-12-01',
        hora_realizacao: '15:00',
    },
    {
        partida_id: 2,
        time_mandante: times[1],
        time_visitante: times[2],
        placar_mandante: 0,
        placar_visitante: 1,
        data_realizacao: '2024-12-10',
        hora_realizacao: '23:10',
    },
    {
        partida_id: 3,
        time_mandante: times[0],
        time_visitante: times[2],
        placar_mandante: 2,
        placar_visitante: 1,
        data_realizacao: '2024-12-05',
        hora_realizacao: '20:00',
    },
    {
        partida_id: 4,
        time_mandante: times[0],
        time_visitante: times[3],
        placar_mandante: 3,
        placar_visitante: 0,
        data_realizacao: '2024-12-10',
        hora_realizacao: '23:10',
    },
    {
        partida_id: 5,
        time_mandante: times[1],
        time_visitante: times[2],
        placar_mandante: 0,
        placar_visitante: 0,
        data_realizacao: '2024-12-16',
        hora_realizacao: '16:00',
    },
    {
        partida_id: 5,
        time_mandante: times[1],
        time_visitante: times[3],
        placar_mandante: 0,
        placar_visitante: 0,
        data_realizacao: '2024-12-20',
        hora_realizacao: '18:00',
    },
    {
        partida_id: 5,
        time_mandante: times[2],
        time_visitante: times[3],
        placar_mandante: 0,
        placar_visitante: 0,
        data_realizacao: '2024-12-20',
        hora_realizacao: '20:00',
    },
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Time:
 *       type: object
 *       properties:
 *         time_id:
 *           type: integer
 *           description: ID do time
 *         nome_popular:
 *           type: string
 *           description: Nome popular do time
 *         sigla:
 *           type: string
 *           description: Sigla do time
 *         escudo:
 *           type: string
 *           description: URL do escudo do time
 *     Partida:
 *       type: object
 *       properties:
 *         partida_id:
 *           type: integer
 *           description: ID da partida
 *         time_mandante:
 *           $ref: '#/components/schemas/Time'
 *         time_visitante:
 *           $ref: '#/components/schemas/Time'
 *         placar_mandante:
 *           type: integer
 *           description: Placar do time mandante
 *         placar_visitante:
 *           type: integer
 *           description: Placar do time visitante
 *         data_realizacao:
 *           type: string
 *           format: date
 *           description: Data da realização da partida
 *         hora_realizacao:
 *           type: string
 *           format: time
 *           description: Hora da realização da partida
 */

/**
 * @swagger
 * /partidas:
 *   get:
 *     summary: Retorna todas as partidas
 *     responses:
 *       200:
 *         description: Lista de partidas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Partida'
 */
app.get('/partidas', (req, res) => {
    console.log("GET /partidas")
    res.status(200).json(partidas);
});

/**
 * @swagger
 * /partidas/{timeNome}:
 *   get:
 *     summary: Retorna as partidas de um time específico
 *     parameters:
 *       - in: path
 *         name: timeNome
 *         required: true
 *         schema:
 *           type: string
 *         description: Nome popular do time
 *     responses:
 *       200:
 *         description: Lista de partidas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Partida'
 *       404:
 *         description: Nenhuma partida encontrada para o time informado
 */
app.get('/partidas/:timeNome', (req, res) => {
    const { timeNome } = req.params;
    const resultado = partidas.filter(
        (partida) =>
            partida.time_mandante.nome_popular.toLowerCase() === timeNome.toLowerCase() ||
            partida.time_visitante.nome_popular.toLowerCase() === timeNome.toLowerCase()
    );

    if (resultado.length > 0) {
        console.log(`GET /partidas/${timeNome}`)
        res.status(200).json(resultado);
    } else {
        res.status(404).json({ error: 'Nenhuma partida encontrada para o time informado.' });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
});