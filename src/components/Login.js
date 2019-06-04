import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

// Import Axios instance to connect with the API
import axiosAPI from './../axios'


class Login extends Component {

	constructor(props){

		super(props)

		this.state = {
      identifier: '',
      password: ''
    };

		this.handleChange = this.handleChange.bind(this)
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
		this.handleErrorMessage = this.handleErrorMessage.bind(this)

	}

	handleFormSubmit(e){
   	
   	e.preventDefault();  

   	let history = this.props.history;

   	const identifier = this.state.identifier;
   	const password = this.state.password;

		axiosAPI.post('login', JSON.stringify(this.state))
		.then(response => {
			if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
				localStorage.setItem('access_token', response.data.access_token)
				history.push('/')
			} else if (response.status === 401) {
				throw Error("Wrong username or password")
			} else {
				throw Error("Something went wrong, please try again later")
			}
		}).catch((err) => {
			
			let errorEl = document.getElementById('error-message');
			errorEl.classList.innerHTML = err;
			errorEl.classList.remove('hidden');
			errorEl.classList.add('flex');
			errorEl.classList.add('shake');
			setTimeout(function(){ 
				errorEl.classList.remove('shake');
			}, 820);

		});

   	// fetch(`https://api-acctest-ob.westeurope.cloudapp.azure.com/dev/v0.1/login`, {
    //   method: 'POST',
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //       identifier,
    //       password
    //   })
    // }).then(response => {

    // 	if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
    //     return response.json()
    //   } else if (response.status === 401) {
    //     throw Error("Wrong username or password")
    //   } else {
    //   	throw Error("Something went wrong, please try again later")
    //   }

	  // }).then(function(data) {

	  //   // Save token to local storage
	  //   const access_token = data.access_token;
    //   localStorage.setItem('access_token', access_token)
    //   history.push('/')
 

	  // }).catch((err) => {
			
		// 	let errorEl = document.getElementById('error-message');
		// 	errorEl.classList.innerHTML = err;
		// 	errorEl.classList.remove('hidden');
		// 	errorEl.classList.add('flex');
		// 	errorEl.classList.add('shake');
		// 	setTimeout(function(){ 
		// 		errorEl.classList.remove('shake');
		// 	}, 820);

		// });

  }

  handleErrorMessage(e){
  	let errorEl = document.getElementById('error-message');
		errorEl.classList.add('hidden');	
		errorEl.classList.remove('flex');
  }

	handleChange(e){
		this.setState(
			{
				[e.target.name]: e.target.value
			}
		)
	}

	render() {
		return (

			<div className="container mx-auto mt-4 px-6 rounded flex flex-wrap">
					<div className="w-1/2 pr-20 pb-8">
						<h1 className="font-serif my-4 font-thin text-gray-800 text-2xl">Inloggen</h1>
						<p className="text-gray-700">Als beleidsmedewerker bij de provincie Zuid-Holland, of als Statenlid van de provincie Zuid-Holland kun je hier inloggen om in de cloud te werken aan het Omgevingsbeleid.</p>
						<form className="my-8" onSubmit={this.handleFormSubmit}>
							<div className="mb-4">
								<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="identifier">
									E-mailadres
								</label>
								<input required className="shadow appearance-none border rounded w-full py-3 leading-loose px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="identifier" id="identifier" type="text" placeholder="bijv. j.doe@pzh.nl" onChange={this.handleChange}/>
							</div>
							<div className="mb-4 mt-6">
								<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
									Wachtwoord
								</label>
								<input required className="shadow appearance-none border rounded w-full py-4 pb-3 leading-loose px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" name="password" id="password" type="password" placeholder="******************" onChange={this.handleChange}/>
							</div>
							<div className="">
								<button className="mbg-color hover:bg-blue-600 text-white inline-block py-2 px-8 rounded focus:outline-none focus:shadow-outline" type="button" type="submit">
									Inloggen
								</button>
							</div>
						</form>
						<div id="error-message" className="container items-center justify-center hidden">
							<div className="bg-red-lightest w-full border border-red-light pr-10 text-red-600 px-4 py-3 rounded relative inline-block" role="alert">
							  <span className="block sm:inline">Wrong username or password.</span>
							  <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={this.handleErrorMessage}>
							    <svg className="fill-current h-6 w-6 text-red" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
							  </span>
							</div>
						</div>
						<div className="mt-20 bottom-0">
							<span className="font-bold block">Veelgestelde vragen</span>
							<span className="underline">Iets met wachtwoord vergeten / Uitleg over inloggen</span>
						</div>
					</div>
					<div className="login-afbeelding fixed">
					</div>

			</div>
			
		);
	}

}
export default withRouter(Login);
