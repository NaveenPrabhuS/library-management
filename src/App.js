/* eslint-disable array-callback-return */
import './App.css';
import ReactPaginate from 'react-paginate';
import {useEffect, useState} from 'react';

function App() {

  const[items,setItems]=useState([]);
  const[pageCount,setPageCount]=useState(0);
  const[searchTerm,setSearchTerm]=useState("");
  const[length,setLength]=useState(0);
  let limit =10;
  
  useEffect(()=>{
    const getComments=async()=>{
      const res = await fetch(
        `http://localhost:3004/books?_page=1&_limit=${limit}`
      );
      const data = await res.json();
      const total = res.headers.get('x-total-count');
      setPageCount(Math.ceil(total/limit));
      setItems(data);
      setLength(data.length);
    };
    getComments();
  }, [limit]);

  
  const fetchComments=async(currentPage)=>{
    const res = await fetch(
      `http://localhost:3004/books?_page=${currentPage}&_limit=${limit}`
    );
    const data=await res.json();
    setLength(data.length);
    return data;
  };

  const handlePageClick =async (data)=>{
    let currentPage=data.selected+1
    const commentsFromServer = await fetchComments(currentPage);
    setItems(commentsFromServer);
  }
  return (
    
    <div >
      <div className="App">
      <input type="text" placeholder="search" onChange={event=>{setSearchTerm(event.target.value)}}/>
      </div>
      <div><h2>Total books in the page= {length}</h2></div>
    <div className="container">
      <div className="row m-2">
        
      {items.filter((items) =>{
        if(searchTerm === ""){
          return items
        }else if(items.title.toLowerCase().includes(searchTerm.toLowerCase()) || (items.author.toLowerCase().includes(searchTerm.toLowerCase())) || (items.subject.toLowerCase().includes(searchTerm.toLowerCase())) || (items.date.toLowerCase().includes(searchTerm.toLowerCase())) ){
          return items
        }
      }).map((items) =>{
        
        return <div key={items.id} className="col-sm-6 col-md-4 v my-2">
          <div className="card shadow-sm w-100" style={{minHeight:225}}>
            <div className="card-body">
              <h5 className="card-title text-center h2">Title:{items.title}</h5>
              <h6 className="card-text">Author:{items.author}</h6>
              <h6 className="card-text">Subject:{items.subject}</h6>
              <h6 className="card-text">Publish-date:{items.date}</h6>
              <h6 className="card-text">Count:{items.count}</h6>
            </div>
          </div>
        </div>
      })}
    </div>
    </div>
    
      <ReactPaginate
      previousLabel={'previous'}
      nextLabel={'next'}
      breakLabel={'...'}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={handlePageClick}
      containerClassName={'pagination justify-content-center'}
      pageClassName={'page-item'}
      pageLinkClassName={'page-link'}
      previousClassName={'page-item'}
      previousLinkClassName={'page-link'}
      nextClassName={'page-item'}
      nextLinkClassName={'page-link'}
      breakClassName={'page-item'}
      breakLinkClassName={'page-link'}
      activeClassName={'active'}
      />
    </div>
  );
}

export default App;
