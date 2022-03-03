import Header from '../../components/Header';
import Title from '../../components/Title';
import {FiPlus} from'react-icons/fi';
import './new.css';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';

export default function New () {
    const { id } = useParams();
    const history = useHistory();

    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [complemento, setComplemento] = useState('');

    const [customers, setCutomers] = useState([]);
    const [loadCustomes, setLoadCustomers] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [idCustumer, setIdCustumer] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function loadCustomers() {
            await firebase.firestore().collection('customers')
            .get()
            .then((snapshot) => {
                let list = [];

                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })

                if(list.length === 0) {
                console.log('Nenhuma empresa encontrada');
                setCutomers([{id: '1', nomeFantasia: 'FREELA'}]);
                setLoadCustomers(false);
                return;
                }

                setCutomers(list);
                setLoadCustomers(false);

                if(id) {
                   loadId(list) 
                }
            })
            .catch((error) => {
                console.log('Deus algum erro!', error);
                setLoadCustomers(false);
                setCutomers([{id: '1', nomeFantasia: ''}]);
            })
        }
        loadCustomers();
      
    }, [id]);

    async function loadId(list) {
        await firebase.firestore().collection('chamados').doc(id)
        .get()
        .then((snapshot) => {
            const data = snapshot.data()
            setAssunto(data.assunto);
            setStatus(data.status);
            setComplemento(data.complemento);

            let index = list.findIndex(item => item.id === data.clienteId);
            setCustomerSelected(index);
            setIdCustumer(true);
        })
        .catch((err) => {
            console.log('Erro ao buscar ID: ', err);
            setIdCustumer(false);
        })
    }

    async function handleRegister(event) {
        event.preventDefault();

        if(idCustumer) {
            await firebase.firestore().collection('chamados')
            .doc(id)
            .update({
                cliente: customers[customerSelected].nomeFantasia,
                clienteId: customers[customerSelected].id,
                assunto: assunto,
                status: status,
                complemento: complemento,
                userId: user.uid

            })
            .then(() => {
                toast.success("Chamado editado com sucesso!");
                setCustomerSelected(0)
                setComplemento('');
                history.push('/dashboard');
            })
            .catch((err) => {
                toast.error('Ops erro ao registar, tente novamente.');
                console.log(err);
            })

            return;
        }

        await firebase.firestore().collection('chamados')
        .add({
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteId: customers[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(() =>{
            toast.success('Chamado criado com sucesso!');
            setComplemento('');
            setCustomerSelected(0);
        })
        .catch((err) => {
            toast.error('Erro ao criar chamado!');
            console.log(err);
        })

    }

    function handleChangeSelect(event) {
        const selected = event.target.value
        setAssunto(selected);
    }

    function handleOptionChange(event) {
        const radioSelected = event.target.value
        setStatus(radioSelected);

    }

    function handleChangeCustomers(event) {
       // console.log('Index seleciona',  event.target.value);
       // console.log('Cliente selecionado', customers[event.target.value]);
        const selectedCustomers = event.target.value
        setCustomerSelected(selectedCustomers);
    }

    return (
        <div>
            <Header/>
            <div className='content'>
                <Title name='Novo Chamado'>
                    <FiPlus size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Cliente</label>
                       
                        {loadCustomes ? (
                            <input type='text' disabled={true} value="Carregando clientes..." /> 
                        ) : (

                            <select value={customerSelected} onChange={handleChangeCustomers}>
                           {
                               customers.map((item, index) => {
                                   return(
                                       <option key={item.id} value={index}>
                                           {item.nomeFantasia}
                                       </option>
                                   )
                               })
                           }
                        </select>

                        )}

                        

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className='status'>
                            <input 
                                    type="radio"
                                    name='radio'
                                    value="Aberto"
                                    onChange={handleOptionChange}
                                    checked={status === 'Aberto'}
                                    />
                                    <span>Em Aberto</span>
                            <input 
                                    type="radio"
                                    name='radio'
                                    value="Progresso"
                                    onChange={handleOptionChange}
                                    checked={status === 'Progresso'}
                                    />
                                    <span>Progresso</span>
                            <input 
                                    type="radio"
                                    name='radio'
                                    value="Atendido"
                                    onChange={handleOptionChange}
                                    checked={status === 'Atendido'}
                                    />
                                    <span>Atendido</span>        
                        </div>
                        <label>Complemento</label>
                        <textarea
                            type='text'
                            value={complemento}
                            onChange={(event) => setComplemento(event.target.value)}
                            placeholder='Descreva seu Problema (Opcional).'
                        ></textarea>
                        <button type='submit'>Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}