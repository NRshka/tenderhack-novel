import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'


function getAvailableCities(query, callback) {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:8000/city`)
            .then(response => response.json())
            .then((response) => {
                resolve(response)
            })
            .catch(reject);
    });
}


function GeolocationAsk({ showAsk, probablyCity }) {
    if (!showAsk) {
        return <div/>
    }
    if (probablyCity != "none") {
        return (
            <Popup
                closeOnDocumentClick={false}
                open={showAsk}
                position="right center"
                modal
                nested
            >
                {close => (
                    <div className="modal">
                        <button className="close" onClick={close}>
                            &times;
                        </button>

                        <div className="header"> Где вы ищите товары? </div>
                        <div className="content">
                        <div>Ваш город - {probablyCity}?</div>
                        <SelectSearch
                            options={[]}
                            getOptions={getAvailableCities}
                            search
                            placeholder="Поиск"
                        />
                        </div>
                        <div className="actions">
                        <button
                            className="button"
                            onClick={() => {
                                console.log('modal closed ');
                                close();
                            }}
                        >
                            Закрыть
                        </button>
                        </div>
                        </div>
                )}
                
            </Popup>
        );
    }
    else {
        return (
            <Popup closeOnDocumentClick={false} open={showAsk} position="right center" modal>
                <div>Выберете город:</div>
            </Popup>
        );
    }
}

export default GeolocationAsk;