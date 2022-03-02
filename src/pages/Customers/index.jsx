import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiUser } from 'react-icons/fi';
import './customers.css';
import { useState } from 'react';

export default function Customers() {
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereco, setEndereco] = useState('');

    function handleAdd(event) {
        event.preventDefault();

        alert('teste');
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