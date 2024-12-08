import './App.css';
import { RouterProvider} from 'react-router-dom';
import Router from './router';

function App() {
    return (
        <div className='app_container'>
            <RouterProvider router={Router} />
        </div>
    );
}

export default App;
