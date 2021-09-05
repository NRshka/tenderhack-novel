import SearchField from "react-search-field";
import './search.css'


function searchInputOnChange(value, event) {
    console.log('OnChange:', value, event)
}


function searchEnter(value, event) {
    console.log('Enter:', value, event)
}


function searchInputClick(value) {
    console.log('Click:', value)
}


function Suggestions() {
    return (
        <div id="suggestionWrapper" className="suggestionWrapper">
            <ul id="suggestion">
                <li>First</li>
                <li>Second</li>
                <li>Third</li>
                <li>Fourth</li>
                <li>Five</li>
                <li>Six</li>
            </ul>
        </div>
    )
}


function SearchBar() {
    return (
        <div>
            <SearchField
                placeholder="Search..."
                onChange={searchInputOnChange}
                onEnter={searchEnter}
                onSearchClick={searchInputClick}
                searchText="Search"
                //classNames="test-class"
            />
                <Suggestions className="suggestionWrapper"/>
        </div>
    )
}

function oldSearchBar() {
    return (
        <form action="#" className="search-header">
            <div className="input-group w-100">
                <select className="custom-select border-right"  name="category_name">
                        <option value="">All type</option><option value="codex">Special</option>
                        <option value="comments">Only best</option>
                        <option value="content">Latest</option>
                </select>
                <input type="text" className="form-control" placeholder="Search" />
                
                <div className="input-group-append">
                    <button className="btn btn-primary" type="submit">
                    <i className="fa fa-search"></i> Search
                    </button>
                </div>
            </div>
        </form> 
    )
}

export default SearchBar;