const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

    router.get('/',(req,res,next) =>{
        //res.status(200).send({
        //mensagem:'Retorna os pedidos'
    //});
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send ({error : error})}
        conn.query(
            'SELECT * FROM produtos;',
            (error,result,fields) => {
                if(error) {return res.status(500).send({error:error})}
                const response = {
                    quantidade: result.length,
                    produtos:result.map(prod => {
                        return {
                            id_produto:produto.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo:'GET',
                                descricao:'Retorna os detalhes de um item específico',
                                url:'http://localhost:3000/produtos/1'
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
            if(error) {
                return res.status(500).send ({error : error})
            }
            conn.query(
                'INSERT INTO produtos(nome,preco)values (?,?)',
            [req.body.nome, req.body.preco],
            (error, result,field) =>{
                conn.release();
                if(error){
                    return res.status(500).send({error:error,});
                }
                const response = {
                    mensagem : "Produto Inserido com sucesso",
                    produtoCriado:{
                        id_produto:result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo:'POST',
                            descricao:'Insere um produto',
                            url:'http://localhost:3000/produtos/1'
                        }

                    }
                }
               return res.status(201).send ({response})
            })
        })
    });

    router.get('/:id_produto',(req,res,next)=>{
        mysql.getConnection((error, conn) => {
            if(error) {return res.status(500).send ({error : error})}
            conn.query(
                'SELECT * FROM produtos WHERE id_produto = ?;',
                [req.params.id_produto],
                (error,result,fields) => {
                    if(error) {return res.status(500).send({error:error})}

                    if(result.length == 0){
                        return res.status(404).send({
                        mensagem:"Não foi encontrado esse ID"
                    })
                }
                    const response = {
                        produto:{
                            id_produto:result[0].id_produto,
                            nome: result[0].nome,
                            preco: result[0].body.preco,
                            request: {
                                tipo:'GET',
                                descricao:'Retorna um produto',
                                url:'http://localhost:3000/produtos/'
                            }
    
                        }
                    }
                   return res.status(200).send ({response})
                }
            )
        })
    });
    router.patch('/',(req,res,next) => {
        mysql.getConnection((error, conn) => {
            if(error) {return res.status(500).send ({error : error})}
            conn.query(
                `UPDATE produtos SET nome =?,
                 preco = ?,
                 where id_produto = ?`,
                 [
                    req.body.nome,
                    req.body.preco,
                    req.body.id_produto
                 ],
                (error,result,fields) => {
                    conn.release();
                    if(error) {return res.status(500).send({error:error})}
                    const response = {
                        mensagem : "Produto Atualizado com sucesso",
                        produtoCriado:{
                            id_produto:result.id_produto,
                            nome: req.body.nome,
                            preco: req.body.preco,
                            request: {
                                tipo:'GET',
                                descricao:'REtorna os detalhes de um produto específico',
                                url:'http://localhost:3000/produtos/' + req.body.id_produto
                            }
                        }
                    }
                    
                    res.status(202).send({response});
                }
            )
        });
    });
    router.delete('/',(req,res,next) => {
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
                        mensagem : 'Pedido removido com sucesso',
                        request: {
                            tipo:'POST',
                            descricao:'Insere um produto',
                            url:'http://localhost:3000/produtos',
                            body: {
                                nome:'Number',
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
        
});
  

module.exports = router;