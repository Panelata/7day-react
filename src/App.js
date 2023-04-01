import React from 'react';
import './App.css';
import ReactLoading from 'react-loading';

import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function App() {
  //Loading states
  const [isLoading, setIsLoading] = React.useState(false);

  //Pokemon states
  const [pokemonList, setPokemonList] = React.useState([]);
  const [pokemonName, setPokemonName] = React.useState('');
  const [pokemonQuery, setPokemonQuery] = React.useState('');
  const [sort, setSort] = React.useState('');

  //Alert states
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertType, setAlertType] = React.useState('alert');
  const [showAlert, setShowAlert] = React.useState(false);

  //Fetching pokemon list
  React.useEffect(()=>{
    getPokemonList();
  }, []);

  //Trigger search pokemon when sort is updated
  React.useEffect(()=>{
    findPokemon(pokemonQuery);
  }, [sort]);

  //Fetch pokemon
  const getPokemonList = () =>{
    setIsLoading(true);
    fetch('https://phpstack-971483-3398278.cloudwaysapps.com/pokemon')
    .then((response)=>{
      //setPokemonList([]);
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
    //Return null if maximum number of pokemon has been reached
    if(pokemonList.length === 6){
      displayAlert('You can only carry 6 pokemon!', 'danger');
      return;
    }

    setIsLoading(true);
    fetch('https://phpstack-971483-3398278.cloudwaysapps.com/pokemon', {
      method: 'POST',
      body: JSON.stringify({'name': pokemonName, 'pokemonID': null})
    })
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.success){
        displayAlert('Added ' + pokemonName + ' to your team!', 'success');
        findPokemon(pokemonQuery);
        setPokemonName('');
      } else {
        setIsLoading(false);
        console.log('Failed to create pokemon');
        setPokemonName('');
      }
    });
  }

  //Update pokemon
  const updatePokemon = (pokemonName, pokemonID) =>{
    console.log('Updating pokemon');
    fetch('https://phpstack-971483-3398278.cloudwaysapps.com/pokemon', {
      method: 'POST',
      body: JSON.stringify({'name': pokemonName, 'pokemonID': pokemonID})
    })
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.success){
        console.log('Successfully updated pokemon');
      } else {
        console.log('Failed to update pokemon');
      }
    });
  }

  //Delete pokemon
  const deletePokemon = (pokemonID)=>{
    console.log('Deleting pokemon: ' + pokemonID);
    setIsLoading(true);
    fetch('https://phpstack-971483-3398278.cloudwaysapps.com/pokemon/' + pokemonID, {
    method: 'DELETE'
    })
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      if(data.success){
        console.log('Successfully deleted pokemon');
        findPokemon(pokemonQuery);
      } else {
        setIsLoading(false);
        console.log('Failed to delete pokemon');
      }
    });
  }

  //Find pokemon
  const findPokemon = (searchQuery) =>{
    console.log(sort);
    setIsLoading(true);
    console.log('Searching for pokemon: ' + searchQuery);
    fetch('https://phpstack-971483-3398278.cloudwaysapps.com/search?name=' + encodeURIComponent(searchQuery) + '&sort=' + sort)
    .then((response) =>{
      //setPokemonList([]);
      return response.json();
    })
    .then((data)=>{
      setIsLoading(false);
      setPokemonList(data.results);
    });
  }

  //Clear sorting and search filters
  const clearFilters = () =>{
    setPokemonQuery('');
    setSort('');
    getPokemonList();
  }

  //Display alert
  const displayAlert = (message, type) =>{
    setAlertMessage(message);
    setAlertType('alert alert-' + type);
    setShowAlert(true);
    setTimeout(()=>{
      setShowAlert(false);
    }, 5000);
  }

  return (
    <div className='App container'>
      <div hidden={!isLoading} className='loading-background'>
        <ReactLoading className='loading-spinner' type={'spin'} color={'FFF'} height={150} width={150} />
      </div>
      <h1>My Pokemon Team</h1>
      <table className='table'>
        <thead>
          <tr>
            <td rowSpan={2}><input value={pokemonQuery} placeholder='Search' type='text' className='input-noborder input-search text-center' onChange={(ev)=>{setPokemonQuery(ev.currentTarget.value)}} /></td>
            <td><i className='pointer'><FontAwesomeIcon icon={faMagnifyingGlass} onClick={(ev)=>{findPokemon(pokemonQuery)}} /></i></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select className='text-center' onChange={(ev)=>{setSort(ev.currentTarget.value)}}>
                <option value=''>Sort By</option>
                <option value='asc'>Ascending</option>
                <option value='dsc'>Descending</option>
              </select>
            </td>
            <td className='pointer' onClick={(ev)=>clearFilters()}>Clear Filters</td>
          </tr>
        {pokemonList.map((pokemon, key) =>{
          return(
            <tr key={pokemon.pokemonID}>
              <td><img className='pokemon-image' src={pokemon.image} /><input className='input-noborder text-center' onBlur={(ev)=>{updatePokemon(ev.target.value, pokemon.pokemonID)}} defaultValue={pokemon.name}/></td>
              <td><i className='pointer'><FontAwesomeIcon icon={faTrash} onClick={()=>{deletePokemon(pokemon.pokemonID)}}/></i></td>
            </tr>
          )
        })}
        </tbody>
      </table>
      <form onSubmit={(ev)=>createPokemon(ev)}>
        <div className='input-group'>
          <input placeholder='Add Pokemon' className='form-control' required pattern='\S(.*\S)?' type='text' onChange={(ev)=>{setPokemonName(ev.target.value)}} value={pokemonName} />
          <button className='btn btn-outline-primary' type='submit'>Save</button>
        </div>
      </form>
      <div hidden={!showAlert} className={alertType}>
        {alertMessage}
      </div>
    </div>
  );
}

export default App;
