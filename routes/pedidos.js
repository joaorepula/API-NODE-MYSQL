const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/',(req,res,next) => {
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send ({error : error})}
        conn.query(
            `SELECT pedidos.produtos_id_produtos, 
            pedidos.quantidade, 
            produtos.id_produto,
            produtos.nome,
            produtos.preco
            FROM pedidos
    INNER JOIN produtos
            on produtos.id_produto = pedidos.produtos_id_produtos;`,
            (error,result,fields) => {
                if(error) {return res.status(500).send({error:error})}
                const response = {
                    pedidos: result.map(pedidos => {
                        return {
                            id_pedido:pedido.id_produto,
                            quantidade: pedido.quantidade,
                            produto: {
                                id_produto:pedido.id_produto,
                                nome:pedido.nome,
                                preco:pedido.preco
                            },
                            
                            request: {
                                tipo:'GET',
                                descricao:'Retorna os detalhes de um item específico',
                                url:'http://localhost:3000/produtos/1' + pedido.id_pedido
                            }
                        }
                    })
                }
                return res.status(200).send({response:result})
            }
        )
    })
});

router.post('/', (req,res,next) => {

    mysql.getConnection((error,conn) => {
        if(error) {return res.status(500).send ({error : error}) }
        conn.query('SELECT * FROM produtos where id_produto =?',
        [req.body.id_produto],
        (error,result,field) =>{
            conn.release();
        if(error) {return res.status(500).send({error:error})}
        if(result.length == 0) {
            return res.status(404).send({
                mensagem:'Produto não encontrado'
                })
            }
            conn.query(
                'INSERT INTO pedidos(id_pedidos,quantidade)values (?,?)',
            [req.body.id_produto, req.body.quantidade],
            (error, result,field) =>{
                conn.release();
                if(error){
                    return res.status(500).send({error:error,});
                }
                const response = {
                    mensagem : "Pedido Inserido com sucesso",
                    pedidoCriado:{
                        id_pedido:result.id_pedido,
                        id_produto:req.body.id_produto,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo:'GET',
                            descricao:'Retorna todos os pedidos',
                            url:'http://localhost:3000/pedidos/'
                        }
                    }
                }
               return res.status(201).send ({response})
            })

        })
    })
        conn.query(
            'INSERT INTO pedidos(id_pedidos,quantidade)values (?,?)',
        [req.body.id_produto, req.body.quantidade],
        (error, result,field) =>{
            if(error){
                return res.status(500).send({error:error,});
            }
            const response = {
                mensagem : "Pedido Inserido com sucesso",
                pedidoCriado:{
                    id_pedido:result.id_pedido,
                    id_produto:req.body.id_produto,
                    quantidade: req.body.quantidade,
                    request: {
                        tipo:'GET',
                        descricao:'Retorna todos os pedidos',
                        url:'http://localhost:3000/pedidos/'
                    }
                }
            }
           return res.status(201).send ({response})
        })
    })

router.get('/:id_pedido',(req,res,next)=>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send ({error : error})}
        conn.query(
            'SELECT * FROM pedidos WHERE produtos_id_produtos = ?;',
            [req.params.id_pedido],
            (error,result,fields) => {
                if(error) {return res.status(500).send({error:error})}

                if(result.length == 0){
                    return res.status(404).send({
                    mensagem:"Não foi encontrado pedido com esse ID"
                })
            }
                const response = {
                    pedido:{
                        id_pedido:result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo:'GET',
                            descricao:'Retorna todos os  produto',
                            url:'http://localhost:3000/pedidos/'
                        }
                    }
                }
               return res.status(200).send ({response})
            }
        )
    })
});

router.delete('/',(req,res,next)=>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send ({error : error})}
        conn.query(
            `DELETE FROM produtos 
             where id_produto = ?`,
             [
                req.body.id_produto
             ],
            (error,result,fields) => {
                conn.release();
                if(error) {return res.status(500).send({error:error})}
                const response ={
                    mensagem : 'Produto removido com sucesso',
                    request: {
                        tipo:'POST',
                        descricao:'Insere um produto',
                        url:'http://localhost:3000/produtos',
                        body: {
                            nome:'String',
                            preco:'Number'
                        }
                    }

                }
                res.status(202).send({
                    mensagem:"Produto deletado com sucesso"
                });
            }
        )
    });
})
  

module.exports = router;