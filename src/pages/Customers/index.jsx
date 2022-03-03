import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser } from 'react-icons/fi';
import './customers.css';
import { useState } from 'react';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

export default function Customers() {
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    async function handleAdd(event) {
        event.preventDefault();

        if(nomeFantasia !== '' && cnpj !== '' && endereco !== '') {
            await firebase.firestore().collection('customers')
            .add({
                nomeFantasia: nomeFantasia,
                cnpj: cnpj,
                endereco: endereco
            }).then(() => {
                setNomeFantasia('');
                setCnpj('');
                setEndereco('');
                toast.success('Empresa cadastrada com sucesso!');
            })
            .catch((error) => {
                console.log(error);
                toast.error('Erro ao cadastar essa empresa!');
            })
        }else{
            toast.error('Prencha todos o campos!');
        }
    }


    return(
        <div>
            <Header/>
           <div className='content'>
            <Title name="Clientes">
                <FiUser size={25} />
            </Title>
            <div className='container'>
                <form className='form-profile customers' onSubmit={handleAdd}>
                    <label> Nome Fantasia</label>
                    <input  type="text"
                            placeholder='Nome da sua empresa' 
                            value={nomeFantasia} 
                            onChange={(event) => setNomeFantasia(event.target.value)} 
                            />
                    <label> CNPJ</label>
                    <input  type="text"
                            placeholder='Seu CNPJ' 
                            value={cnpj} 
                            onChange={(event) => setCnpj(event.target.value)} 
                            />
                    <label> Endereço</label>
                    <input  type="text"
                            placeholder='Endereço da empresa '
                            value={endereco} 
                            onChange={(event) => setEndereco(event.target.value)} 
                            />

                    <button type='submit'>Cadastrar</button>
                </form>
            </div>
           </div>
        </div>
    )
}