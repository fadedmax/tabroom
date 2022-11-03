import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import styles from './header.module.css';
import { loadTournSearch, clearTournSearch } from '../redux/ducks/search';

const SearchBar = () => {

	const dispatch = useDispatch();
	const sector = useSelector((state) => state.sector);
	const tourn = useSelector((state) => state.tourn);
	const tournSearch = useSelector((state) => state.tournSearch);

	const setupSearch = {};

	if (sector === 'tab') {
		setupSearch.api = `${process.env.REACT_APP_API_BASE}/tourn/${tourn}/register/search`;
		setupSearch.tag = 'Search Attendees';
	} else {
		setupSearch.api = `${process.env.REACT_APP_API_BASE}/public/search/all`;
		setupSearch.tag = 'Search Tournaments';
	}

	const {
		register,
		formState: { isValid },
		handleSubmit,
	} = useForm({
		mode: 'all',
		defaultValues: {
			searchString: '',
		},
	});

	const searchHandler = async (data) => {
		if (data.searchString.length > 2) {
			dispatch(loadTournSearch(data.searchString, 'future'));
		}
	};

	const escHandler = (e) => {
		e.preventDefault();
		if (e.key === 'Escape') {
			dispatch(clearTournSearch());
		}
	};

	const clearSearchResults = () => {
		dispatch(clearTournSearch());
	};

	const searchRef = React.useRef(null);

	const goToSearch = (e) => {
		e.preventDefault();
		if (e.ctrlKey && e.key === 's') {
			searchRef.current.focus();
		}
	};

	document.addEventListener('keydown', goToSearch);

	const dynamicSearchHandler = async (data) => {
		if (data.searchString.length > 4) {
			dispatch(loadTournSearch(data.searchString, 'future'));
		}
		if (!data.searchString.length) {
			// tell the state to wipe the results altogether here somehow.
			// also trigger this with a button click
		}
	};

	return (
		<span>
			<form
				onChange={handleSubmit(dynamicSearchHandler)}
				onSubmit={handleSubmit(searchHandler)}
			>
				<span id={styles.search} title={setupSearch.tag}>
					<input
						id             = {styles.searchtext}
						type           = "searchString"
						maxLength      = "128"
						ref            = {searchRef}
						name           = "search"
						placeholder    = {setupSearch.tag}
						className      = "notfirst"
						tabIndex       = "-1"
						autoComplete   = "off"
						autoCorrect    = "off"
						autoCapitalize = "off"
						spellCheck     = "false"
						onKeyDown      = {escHandler}
						{...register('searchString', { required: true })}
					/>
					<button
						type      = "submit"
						className = {styles.searchbutton}
						disabled  = {!isValid}
					>
						<img alt = "Search" src = "/images/search.png" />
					</button>
				</span>
			</form>

			{
				(tournSearch.exactMatches?.length > 0
					|| tournSearch.partialMatches?.length > 0
				) &&
				<div id={styles.searchOverlay} tabIndex="-1" onKeyDown={escHandler}>
					<div id={styles.searchResults}>
						<div
							id      = {styles.searchResultsHeader}
							onClick = {clearSearchResults}
						> Clear Search Results
							<span className="fa fa-sm fa-times" />
						</div>
						<SearchResults />
					</div>
				</div>
			}
		</span>
	);
};

const SearchResults = (results) => {
	const tournSearch = useSelector((state) => state.tournSearch);

	if (!tournSearch || !tournSearch.searchString?.length) {
		return;
	}

	if (!tournSearch.partialMatches.length && !tournSearch.exactMatches.length) {
		return (
			<div>
				<div id={styles.nada}>
					<p>
						No results found for {tournSearch.searchString}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			{
				tournSearch.exactMatches?.map((match) => (
					<SearchItem
						key   = {match.id}
						scope = "exact"
						term  = {tournSearch.searchString}
						tourn = {match}
					/>
				))
			}
			{
				tournSearch.partialMatches?.map((match) => (
					<SearchItem
						key   = {match.id}
						scope = "partial"
						term  = {tournSearch.searchString}
						tourn = {match}
					/>
				))
			}
		</div>
	);
};

const SearchItem = (props) => {

	const tournName = props.tourn.name;
	const start = new Date(props.tourn.start);
	const end = new Date(props.tourn.end);

	let dateString = '';
	const monthName = start.toLocaleString('default', { month: 'short' });

	// need to replace the below with a way to generate an actual string

	if (start.getDate() === end.getDate()) {
		dateString = `${monthName} ${start.getDate()}, ${start.getFullYear()}`;
	} else {
		dateString = `${monthName} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
	}

	return (
		<div className={styles[props.scope]}>
			<a
				href={`${process.env.REACT_APP_LEGACY_URL}/index/tourn/index.mhtml?tourn_id=${props.tourn.id}`}
				className={styles.searchLink}
			>
				<div className={styles.tournName}>
					{ tournName }
				</div>
				<div className={styles.shorter}>
					<span className={`third ${styles.location}`}>
						{props.tourn.city}
						{props.tourn.state && props.tourn.city ? ', ' : '' }
						{props.tourn.state ? props.tourn.state : '' }
						{props.tourn.state !== 'US' && props.tourn.country ? props.tourn.country : '' }
					</span>
					<span className={`third ${styles.circuits}`}>
						{props.tourn.circuits}
					</span>
					<span className={`${styles.dates}`}>
						{ dateString }
					</span>
				</div>
			</a>
		</div>
	);
};

export default SearchBar;
