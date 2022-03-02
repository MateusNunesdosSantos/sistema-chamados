import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { AuthContext } from '../../contexts/auth';

function SignUp () {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password,  setPassword] = useState('');

    const { signUp, loadingAuth } = useContext(AuthContext);

    function handleSubmit(event) {
        event.preventDefault();
        
        if (name !== '' && email !== '' && password !== '') {
            signUp(email, password, name)
        } 
    }

    return(
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt="logo" />
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Cadastrar uma conta</h1>
                    <input  type="text" 
                            placeholder='Seu nome' 
                            value={name} 
                            onChange={(event) => setName(event.target.value)}
                            />
                    <input  type="text" 
                            placeholder='email@email.com' 
                            value={email} 
                            onChange={(event) => setEmail(event.target.value)}
                            />

                    
                    <input  type="password" 
                            placeholder='********'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            />

                    
                    <button type='submit'>{loadingAuth ? 'Carregando...' : 'Cadastrar'}</button>
                </form>
                <Link to={'/'}>Já tem uma conta? Entre </Link>
            </div>
        </div>
    )
}

export default SignUp;