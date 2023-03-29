import React from 'react';
import './App.css';

function App() {
  //States
  const [pokemonList, setPokemonList] = React.useState([]);
  const [pokemonName, setPokemonName] = React.useState('');

  //Fetching pokemon list
  React.useEffect(()=>{
    getPokemonList();
  }, []);

  //Fetch pokemon
  const getPokemonList = () =>{
    fetch('https://phpstack-971483-3398278.cloudwaysapps.com/pokemon')
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      setPokemonList(data.pokemonList);
    });
  }

  //Create new pokemon
  const createPokemon = (ev) =>{
    ev.preventDefault();
    fetch('https://phpstack-971483-3398278.cloudwaysapps.com/pokemon', {
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
        console.log('Failed to create pokemon');
        setPokemonName('');
      }
    });
  }

  return (
    <div className='App container'>
      <h1>My Pokemon List</h1>
      <table className='table'>
        <thead>
          <tr>
            <td><strong>Name</strong></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
        {pokemonList.map((pokemon, key) =>{
          return(
            <tr key={key}>
              <td>{pokemon.name}</td>
              <td>X</td>
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
