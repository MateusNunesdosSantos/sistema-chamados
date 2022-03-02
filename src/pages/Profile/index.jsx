import { useState, useContext } from 'react';
import Header from '../../components/Header';
import Title from '../../components/Title';
import './profile.css';
import avatar from '../../assets/avatar.png';
import firebase from '../../services/firebaseConnection';
import { toast } from 'react-toastify';

import { AuthContext } from '../../contexts/auth';

import { FiSettings, FiUpload } from 'react-icons/fi'


export default function Profile() {
    const { user, signOut, setUser, storageUser } = useContext(AuthContext);

    const [ name, setName ] = useState(user && user.name);
    const [ email, setEmail ] = useState(user && user.email);

    const [ avatarUrl, setAvatarUrl ] = useState(user && user.avatarUrl);
    const [ imageAvatar, setImageAvatar ] = useState(null);


    function handleFile(event) {
        if(event.target.files[0]){
            const image = event.target.files[0];
            
            if(image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(event.target.files[0]))
            } else {
                toast.warn('Envie uma imagem do tipo PNG ou JPEG!');
                setImageAvatar(null);
                return null;
            }
        }
    }

   async  function handleUpload() {
        const currentUid = user.uid;

        const uploadTasl = await firebase.storage()
        .ref(`images/${currentUid}/${imageAvatar.name}`)
        .put(imageAvatar)
        .then(async () => {
            toast.success('Foto enviada com sucesso!');

            await firebase.storage().ref(`images/${currentUid}`)
            .child(imageAvatar.name).getDownloadURL()
            .then( async (url) => {
                let urlPhoto = url;

                await firebase.firestore().collection('users')
                .doc(user.uid)
                .update({
                    avatarUrl: urlPhoto,
                    name: name
                })
                .then(() => {
                   let data = {
                       ...user,
                       avatarUrl: urlPhoto,
                       name: name
                   };
                   setUser(data);
                   storageUser(data);
                })
            })
        } )

    }

   async function handleSave(event) {
        event.preventDefault();

            if(imageAvatar === null && name !== '') {
            await firebase.firestore().collection('users')
            .doc(user.uid)
            .update({
                name: name
            })
            .then(() => {
                let data = {
                    ...user,
                    name: name
                };
                setUser(data)
                storageUser(data);
            })
        }
        else if (name !== "" && imageAvatar !== null){
            handleUpload()
        }
    }

    return(
        <div>
            <Header/>
            <div className='content'>
                <Title name='Meu Perfil'>
                    <FiSettings size={25}/>
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleSave}>
                        <label className='label-avatar'>
                            <span>
                                <FiUpload color='#FFF' size={25}/>
                            </span>

                            <input type='file' accept='image/**' onChange={handleFile} />
                            {avatarUrl === null ? 
                                <img src={avatar} width='250' height='250' alt='Photo user'/> 
                                : 
                                <img src={avatarUrl} width='250' height='250' alt='Photo user'/> 
                            }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />

                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />

                        <button type='submit'>Salvar</button>
                    </form>
                </div>

                <div className='container'>
                        <button className='logout-btn' 
                                onClick={ () => signOut()}>Sair</button>
                </div>
            </div>
        </div>
    )
}