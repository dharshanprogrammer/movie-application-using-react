import React from "react";

const Search = ({value,setSearchTerm}) =>{
    return(
        <div className="search">
            <div>
                <img src="./search.svg" alt="search-image" />
                <input type="text"
                placeholder="Search Through Thousands Of Movies"
                onChange={(e)=>setSearchTerm(e.target.value)} />
                
            </div>
            
        </div>
    )
}
export default Search;



