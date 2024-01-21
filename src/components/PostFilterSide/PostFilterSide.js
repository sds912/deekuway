import { Checkbox, Select } from "antd";
import { useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import './PostFilterSide.css';
import { EnvironmentOutlined } from "@ant-design/icons";
export const PostFilterSide = () => {

	const [address, setAddress] = useState('');
	const [typePropertyOpened, setTypePropertyOpened] = useState(true);
	const [autrePieceOpened, setAutrePieceOpened] = useState(true);
    const [posts, setPosts] = useState([]);


    const handleChange = (address) => {
        setAddress(address);
      };
  
   
      const handleSelect = async (address) => {
        try {
          const results = await geocodeByAddress(address);
          const latLng  = await getLatLng(results[0]);
         // setValue('latitude', latLng.lat);
         // setValue('longitude',latLng.lng);
         // setValue('address', address);
          setAddress(address);
        } catch (error) {
         // message.error(error);
        }
      };
    return (
     <div style={{
        height: '80vh',
        overflowY: 'auto',
        scrollbarWidth: '2px',
        overflowX: 'hidden',
        position: 'fixed',
        width: "300px",
        marginTop: '140px',
        paddingBottom: '160px'
         }} className="bg-white pt-4 px-3">  
    <div >
       <div>
        <div className="d-flex justify-content-between w-100 border-bottom">
            <div className="pb-4 fw-bolder">
                Filtre: {posts.length} Resultats
            </div>
            <div>
                <button style={{width: '60px'}} className="btn btn-outline-warning">
                    RESET
                </button>
            </div>

        </div>
        

        <div className='form-group w-100 mt-3'>
			<label className='form-label fw-bold text-muted'>Adresse de localisation</label>
                {
                    
                    <PlacesAutocomplete
                    value={address}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    searchOptions={{
                    componentRestrictions: { country: ['SN']},
                    }}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                        {...getInputProps({
                            placeholder: 'Adresse de localisation...',
                            className: 'form-control w-100',
                        })}
                        />
                        <div>
                        {loading ? <div>Loading...</div> : null}

                        {suggestions.map((suggestion) => {
                            const style = {
                            backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '5px',
                            };

                            return (
                            <div
                                {...getSuggestionItemProps(suggestion, {
                                style,
                                })}
                            >
                                <EnvironmentOutlined style={{ marginRight: '5px' }} />
                                {suggestion.description}
                            </div>
                            );
                        })}
                        </div>
                    </div>
                    )}
                </PlacesAutocomplete>
                
               }
			</div>
            <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center">
                    <label className="fw-bold text-muted">Type de propriété</label>
                    <div>
                        {!typePropertyOpened && <i vlas className="fa fa-chevron-down fw-bold text-muted"  onClick={() => setTypePropertyOpened(true)} ></i>}
                        {typePropertyOpened  && <i vlas className="fa fa-chevron-up fw-bold text-muted"    onClick={() => setTypePropertyOpened(false)} ></i>}
                    </div>
                </div>
                 { typePropertyOpened &&
                  <div className="form-group mt-4">
                    <div className="mt-2 fw-bold"><Checkbox  value={'appartement'} >Appartement</Checkbox></div>
                    <div className="mt-2 fw-bold"><Checkbox value={'studio'}>Studio</Checkbox></div>
                    <div className="mt-2 fw-bold"><Checkbox value={'chambre'}>Chambre</Checkbox></div>
                    <div className="mt-2 fw-bold"><Checkbox value={'maison'}>Maison</Checkbox></div>
                    <div className="mt-2 fw-bold"><Checkbox value={'bureau'}>Bureau</Checkbox></div>
                    <div className="mt-2 fw-bold"><Checkbox value={'magasin'}>Magasin</Checkbox></div>
                  </div>}
            </div>
            <div className="form-group mt-4">
                <label className="fw-bold text-muted">Votre budget</label>
                <div className="row">
                    <div className="col-6">
                    <label className="fw-bold">Min</label>
                    <input className="form-control w-100 fw-bold" placeholder="50 000"  />
                    </div>
                    <div className="col-6">
                    <label className="fw-bold">Max</label>
                    <input className="form-control w-100 fw-bold" placeholder="150 000" />
                    </div>
                </div>
            </div>
            <div className="form-group mt-4">
                <label className="fw-bold text-muted">Piéces</label>
                <div className="row">
                    <div className="col-6">
                        <label className="fw-bold">Chambres</label>
                        <Select defaultValue={1}>
                            <Select.Option value={1}>1 chambre</Select.Option>
                            <Select.Option value={2}>2 chambres</Select.Option>
                            <Select.Option value={3}>3 chambres</Select.Option>
                            <Select.Option value={4}>4 chambres</Select.Option>
                            <Select.Option value={5}>5 chambres</Select.Option>
                            <Select.Option value={0}>plus de 5 chambres</Select.Option>
                        </Select>
                    </div>
                    <div className="col-6">
                        <label className="fw-bold">Salle de bain</label>
                        <Select defaultValue={1}>
                            <Select.Option value={1}>1 salle de bain</Select.Option>
                            {<Select.Option value={2}>2 salle de bain</Select.Option>}
                            {<Select.Option value={3}>3 salle de bain</Select.Option>}
                            {<Select.Option value={0}>Plus de 3</Select.Option>}     
                        </Select>
                    </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                   <label className="fw-bold text-muted">Autres piéces</label>
                    <div>
                        {!autrePieceOpened && <i vlas className="fa fa-chevron-down fw-bold text-muted"  onClick={() => setAutrePieceOpened(true)} ></i>}
                        {autrePieceOpened  && <i vlas className="fa fa-chevron-up fw-bold text-muted"    onClick={() => setAutrePieceOpened(false)} ></i>}
                    </div>
                </div>
                {autrePieceOpened && 
                <div className="form-group mt-4">
                    <div className="mt-2 fw-bold"><Checkbox value={"sallon"} >Sallon</Checkbox></div>
                    <div className="mt-2 fw-bold"><Checkbox value={"cuisine"}>Cuisine</Checkbox></div>
                    <div className="mt-2 fw-bold"><Checkbox value={"balcon"}>Balcon</Checkbox></div>
                    <div className="mt-2 fw-bold"><Checkbox value={"espacefamiliale"}>Espace Familiale</Checkbox></div>
                </div>}
            </div>
       </div>
       
    </div>
    
    <button
         style={{
            position: 'fixed',
            bottom: '20px',
            left: "50px",
            width: "200px",
            height: "45px",
            backgroundColor: '#02627a',
            border: 'none'
         }}
        className="btn btn-warning fw-bold text-white">
        Appliquer le filtre
       </button>
    </div>
    )
}