import { useContext, useState, useEffect, cloneElement } from "react"
import Header from "../../components/Header";
import { AuthContext } from '../../contexts/auth';
import Title from '../../components/Title';
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi'
import firebase from '../../services/firebaseConnection';
import { format } from 'date-fns'

import './dashboard.css';
import { Link } from "react-router-dom";

const listRef = firebase.firestore().collection('chamados').orderBy('created', 'desc')

export default function Dashboard(){
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] =useState(true);
    const [loadingMore,  setLoadingMore] = useState(false);
    const [isEmpty, setIsEmpyt] = useState(false);
    const [lastDocs, setLastDocs] = useState();

    const { signOut } = useContext(AuthContext);


    useEffect(() => {
        loadChamados();
    }, []);


    async function loadChamados() {
        await listRef.limit(5)
            .get()
            .then((snapshot) => {
                updateState(snapshot)
            })
            .catch((err) => {
                console.log('Erro au fazer a busca de chamados', err);
                setLoadingMore(false);
            })

            setLoading(false);
    }

    async function updateState(snapshot) {
        const isCollactionEmpty = snapshot.size === 0;

        if(!isCollactionEmpty){
            let list = [];

            snapshot.forEach((doc)=>{
                list.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })

            const lastDoc = snapshot.docs[snapshot.docs.length -1]; //pegando ultimo documento buscado
            
            setChamados(chamados => [...chamados, ...list]);
            setLastDocs(lastDoc);
        }else {
            setIsEmpyt(true);
        }

        setLoadingMore(false);
    }

    async function handleMore() {
        setLoadingMore(true);
        await listRef.startAfter(lastDocs).limit(5)
        .get()
        .then((snapshot) => {
            updateState(snapshot)
        })
        .catch((err) => {
            console.log('Erro ao buscar Mais dados', err)
        })
    }

 

    if(loading){
        return(
            <div>
                <Header/>
                <div className="content">
                <Title name='Atendiamentos'>
                    <FiMessageSquare size={25} />
                </Title> 
                <div className="container dashboard">
                    <span>Buscando chamaodos...</span>
                </div>
                </div>
            </div>
        )
    }

    return(
        <div>
            <Header/>
            <div className="content">
                <Title name='Atendiamentos'>
                    <FiMessageSquare size={25} />
                </Title> 

                {chamados.length === 0 ? (
                     <div className="container dashboard">
                     <span>Nenhum chamado registrado...</span>
                     <Link to={'/new'} className='new'>
                     <FiPlus size={25} color='#FFF' />
                         Novo Chamado
                     </Link>
                 </div> 
                ) : (
                   <>
                    <Link to={'/new'} className='new'>
                     <FiPlus size={25} color='#FFF' />
                         Novo Chamado
                     </Link>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Cliente</th>
                                <th scope="col">Assunto</th>       
                                <th scope="col">status</th>       
                                <th scope="col">Cadastrado em</th>       
                                <th scope="col">#</th>       
                            </tr>
                        </thead>
                        <tbody>
                        {chamados.map((item, index) => {
                            return(       
                                <tr key={index}>
                                    <td data-label='cliente'>{item.cliente}</td>
                                    <td data-label='Assunto'>{item.assunto}</td>
                                    <td data-label='Status'>
                                        <span className="badge" 
                                              style={{backgroundColor: item.status === 'Aberto' ? '#5Cb85c' :  '#999' }} >{item.status}</span>
                                    </td>
                                    <td data-label='Cadastrado'>{item.createdFormated}</td>
                                    <td data-label='#'>
                                        <button className="action" style={{backgroundColor: '#3583f6'}}>
                                            <FiSearch color="#FFF" size={17}/> 
                                        </button>

                                        <button className="action" style={{backgroundColor: '#F6a935'}}>
                                            <FiEdit2 color="#FFF" size={17}/> 
                                        </button>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>


                    {loadingMore && <h3 style={{textAlign: 'center', marginTop: 15}}>Buscando dados...</h3>}
                    {!loadingMore && !isEmpty &&
                    <button className="btn-more" onClick={handleMore}>Buscar mais</button>}
                   </> 
                )}              
            </div> 
        </div>
    )
}