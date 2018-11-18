import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    InputGroup, FormControl, Button,
    ListGroup, ListGroupItem, ControlLabel,
    Col
} from 'react-bootstrap';

import xivApi from '../lib/xivapi';

import '../styles/characterSelect.css';

class CharacterSelect extends Component {
    static propTypes = {
        xivApi: PropTypes.instanceOf(xivApi).isRequired,
        characterSelected: PropTypes.func.isRequired
    }
    constructor(props) {
        super(props);        
        this.state = {
            foundCharacters: [],
            disableSearchButton: false
        };
        this.handleCharacterSearch = this.handleCharacterSearch.bind(this);
        this.selectedCharacter = this.selectedCharacter.bind(this);
    }
    componentDidMount() {
    }
    handleCharacterSearch() {
        this.setState({ disableSearchButton: true });
        this.props.xivApi.findCharacter(this.characterSearchInput.value).then(character => {
            this.setState({ foundCharacters: character.Results, disableSearchButton: false });
        });
    }
    selectedCharacter(selectedChar) {
        this.props.xivApi.getCharacter(selectedChar.ID, 'FR,FC,FCM').then(char => {
            this.setState({ foundCharacters: [] });
            this.props.characterSelected(char);
            this.characterSearchInput.value = '';
        })
    }
    render() {
        const { foundCharacters, disableSearchButton } = this.state;
        const mappedFoundCharacters = foundCharacters.map(char => {
            return (
                <ListGroupItem key={char.ID} onClick={(e) => this.selectedCharacter(char)}>
                    <img src={char.Avatar} alt={char.Name}></img>
                    { char.Name } | { char.Server }
                </ListGroupItem>
            );
        });
        const displayFoundCharacters = (
            <ListGroup>
            {mappedFoundCharacters}
            </ListGroup>
        );
        return (            
            <main id="character" className="container-fluid">            
                <Col xs={4} sm={4} md={4} lg={4}>
                    <ControlLabel>Find Character: </ControlLabel>
                </Col>
                <Col xs={8} sm={8} md={8} lg={8}>
                    <InputGroup>
                        <FormControl
                            id="characterSearch"
                            type="text"
                            inputRef={ref => { this.characterSearchInput = ref; }}
                            disabled={disableSearchButton}
                        />
                        <InputGroup.Button>
                            <Button bsStyle="primary" disabled={disableSearchButton} onClick={this.handleCharacterSearch}>Find</Button>
                        </InputGroup.Button>
                    </InputGroup>
                    {displayFoundCharacters}
                </Col>
            </main>
        );
    }
}

export default CharacterSelect;
