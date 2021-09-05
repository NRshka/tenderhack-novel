import { useState } from 'react';
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'
import { Redirect } from 'react-router-dom';


function getOptions(query, callback) {
    if (query == "") {
        return new Promise((resolve, reject) => {
            resolve([])
        })
    }
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8000/search/${query}`)
            .then(response => response.json())
            .then((response) => {
                resolve(response)
            })
            .catch(reject);
    });
}

const SearchBar = ({ geolocation }) => {
    const [choice, setChoice] = useState(null);

    return (
        <div>
            <SelectSearch
                options={[]}
                getOptions={getOptions}
                search
                placeholder="Search"
                onChange={setChoice}
            />
            {
                choice && <Redirect to={"/product/" + choice + "/" + geolocation}/>
            }
        </div>
    )
}

export default SearchBar;