import React from 'react';
import './App.css';
import ReactLoading from 'react-loading';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function App() {
  //Loading states
  const [isLoading, setIsLoading] = React.useState(false);

  //Pokemon states
  const [pokemonList, setPokemonList] = React.useState([]);
  const [pokemonName, setPokemonName] = React.useState('');

  //Fetching pokemon list
  React.useEffect(()=>{
    getPokemonList();
  }, []);

  //Fetch pokemon
  const getPokemonList = () =>{
    setIsLoading(true);
    //fetch('https://phpstack-971483-3398278.cloudwaysapps.com/pokemon')
    fetch('http://127.0.0.1:8000/pokemon')
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      setIsLoading(false);
      setPokemonList(data.pokemonList);
    });
  }

  //Create new pokemon
  const createPokemon = (ev) =>{
    ev.preventDefault();
    setIsLoading(true);
    //fetch('https://phpstack-971483-3398278.cloudwaysapps.com/pokemon', {
    fetch('http://127.0.0.1:8000/pokemon', {
      method: 'POST',
      body: JSON.stringify({'name': pokemonName, 'pokemonID': null})
    })
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.success){
        console.log('Successfully added pokemon');
        getPokemonList();
        setPokemonName('');
      } else {
        setIsLoading(false);
        console.log('Failed to create pokemon');
        setPokemonName('');
      }
    });
  }

  //Delete pokemon
  const deletePokemon = (pokemonID)=>{
    console.log('Deleting pokemon: ' + pokemonID);
    setIsLoading(true);
    //fetch('https://phpstack-971483-3398278.cloudwaysapps.com/pokemon/' + pokemonID, {
    fetch('http://127.0.0.1:8000/pokemon/' + pokemonID, {
    method: 'DELETE'
    })
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.success){
        console.log('Successfully deleted pokemon');
        getPokemonList();
      } else {
        setIsLoading(false);
        console.log('Failed to delete pokemon');
      }
    });
  }

  return (
    <div className='App container'>
      <div hidden={!isLoading} className='loading-background'>
        <ReactLoading className='loading-spinner' type={'spin'} color={'FFF'} height={150} width={150} />
      </div>
      <h1>My Pokemon List</h1>
      <table className='table'>
        <thead>
          <tr>
            <td><strong>Name</strong></td>
          </tr>
        </thead>
        <tbody>
        {pokemonList.map((pokemon, key) =>{
          return(
            <tr key={key}>
              <td>{pokemon.name}</td>
              <td><i><FontAwesomeIcon icon={faTrash} onClick={()=>{deletePokemon(pokemon.pokemonID)}}/></i></td>
            </tr>
          )
        })}
        </tbody>
      </table>
      <form onSubmit={(ev)=>createPokemon(ev)}>
        <label>Pokemon</label>
        <input required pattern='\S(.*\S)?' type='text' onChange={(ev)=>{setPokemonName(ev.target.value)}} value={pokemonName} />
        <button type='submit'>Save</button>
      </form>
    </div>
  );
}

export default App;
