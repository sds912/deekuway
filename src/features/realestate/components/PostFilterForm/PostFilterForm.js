import { useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import './PostFilterForm.css';
import { EnvironmentOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { deleteFilterParams} from "../../services/localStorageService";
import RangeSlider from 'react-range-slider-input';

export const PostFilterForm = ({onSubmitFilter, resultsize}) => {

	const [address, setAddress] = useState('');
	const [typePropertyOpened, setTypePropertyOpened] = useState(true);
	const [autrePieceOpened, setAutrePieceOpened] = useState(true);
	const {register, handleSubmit ,  setValue, watch,  reset} = useForm();
    const [max, setMax] = useState(0);
    const [min, setMin] = useState(20000);
    const [currency, setCurrency] = useState('CFA');

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

      const filter = data => {
       // saveFilterParams(data);
        onSubmitFilter(data);
      }


      const option     = watch('mode');
      const bedRooms   = watch('bedRooms');
      const sallons    = watch('sallons');
      const toilets    = watch('toilet');
      const bathRooms  = watch('bathRooms');
      const property   = watch('property');
      const otherRooms   = watch('otherRooms');
    
      

    return (
     <>  
    
    <form onSubmit={handleSubmit(filter)} className="form" id="filter-form"  >

    <div style={{
        height: '70vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingBottom: '40px',
        marginBottom: '20px',
        paddingLeft: "4px",
        paddingRight: "4px",
    }} >
       <div>
        <div className="d-flex justify-content-between w-100 border-bottom">
            <div className="pb-4 fw-bolder">
                Filtre: {resultsize} Resultats
            </div>
            <div>
                <button 
                style={{width: '60px'}} 
                className="btn btn-outline-secondary"
                onClick={() => {
                    reset();
                    deleteFilterParams();

                }}
                >
                    RESET
                </button>
            </div>

        </div>
        
       { <div className="form-group py-2">
          <div className="d-flex justify-content-between align-items-center">
             <label for="filter-location" className={(option && option.includes('location') )? "option option-active bg-secondary fw-bold" : "option fw-bold"}>
                 LOCATION
                 <input {...register('mode')} value="location" type='checkbox' id="filter-location" style={{
                    visibility: 'hidden'
                 }} />
             </label>
             <label for="filter-co-loc" className={(option && option.includes('co-location') )? "option option-active bg-secondary fw-bold" : "option fw-bold"}>
                 CO-LOCATION
                 <input  {...register('mode')} value="co-location" type='checkbox' id="filter-co-loc" style={{
                    visibility: 'hidden'
                 }} />
             </label>
             <label for="filter-vente" className={(option && option.includes('vente') )? "option option-active bg-secondary fw-bold" : "option fw-bold"}>
                 VENTE
                 <input  {...register('mode')} value="vente" type='checkbox' id="filter-vente" style={{
                    visibility: 'hidden'
                 }} />
             </label>
             
          </div>
        </div> }

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
                    </PlacesAutocomplete> }
            
            
		</div>
        <div className="form-group mt-4">
            <label className="fw-bold text-muted">Votre budget ({currency})</label>
           { /*<div className="row">
                <div className="col-6">
                <label className="fw-bold">Min</label>
                <input className="form-control w-100 fw-bold" placeholder="50 000" {...register('minPrice')}  />
                </div>
                <div className="col-6">
                <label className="fw-bold">Max</label>
                <input className="form-control w-100 fw-bold" placeholder="150 000" {...register('maxPrice')} />
                </div>
                    </div> */}

            <div className="d-flex">
                <div>
                  <span>Min: </span>  
                  <span className="text-secondary fw-bold">{min}</span>
                </div>
                <div className="ms-4">
                    <span>Max: </span>
                    <span className="text-secondary fw-bold">{max}</span>
                </div>
            </div>
            <RangeSlider 
            id="range-slider-ab"
            className="margin-lg mt-3 mb-4"
            step={"any"}
            rangeSlideDisabled={false}
            onInput = {(values) => {
                const maxi = parseInt(values[1]*20000);
                const mini = parseInt(values[0]*20000);

                setMax(maxi);
                setMin(mini);

                setValue('maxPrice', maxi);
                setValue('minPrice', mini);
            }}

        
             />        
        </div>
        <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center bg-light p-2 border" style={{borderRadius: '4px'}}>
                <label className="fw-bold text-muted">Type de propriété</label>
                <div className="chevron-btn bg-secondary">
                    {!typePropertyOpened && <i vlas className="fa fa-chevron-down fw-bold text-white"  onClick={() => setTypePropertyOpened(true)} ></i>}
                    {typePropertyOpened  && <i vlas className="fa fa-chevron-up fw-bold text-white"    onClick={() => setTypePropertyOpened(false)} ></i>}
                </div>
            </div>
            { typePropertyOpened &&
            <div className="form-group mt-4">
                    <div className="mt-2 fw-bold"><input disabled={property && property.length >= 2 && !property.includes('appartement')} type="checkbox" value={'appartement'} {...register('property')} /> <span className="ms-2">Appartement</span></div>
                    <div className="mt-2 fw-bold"><input disabled={property && property.length >= 2 && !property.includes('studio')} type="checkbox" value={'studio'} {...register('property')} /> <span className="ms-2">Studio</span> </div>
                    <div className="mt-2 fw-bold"><input disabled={property && property.length >= 2 && !property.includes('chambre')} type="checkbox" value={'chambre'} {...register('property')} /> <span className="ms-2">Chambre</span> </div>
                    <div className="mt-2 fw-bold"><input disabled={property && property.length >= 2 && !property.includes('maison')} type="checkbox" value={'maison'} {...register('property')} /> <span className="ms-2">Maison</span> </div>
                    <div className="mt-2 fw-bold"><input disabled={property && property.length >= 2 && !property.includes('bureau')} type="checkbox" value={'bureau'} {...register('property')} /> <span className="ms-2">Bureau</span> </div>
                    <div className="mt-2 fw-bold"><input disabled={property && property.length >= 2 && !property.includes('magasin')} type="checkbox" value={'magasin'} {...register('property')} /> <span className="ms-2">Magasin</span> </div>
            </div>}
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3 bg-light p-2 border"  style={{borderRadius: '4px'}}>
            <label className="fw-bold text-muted">Piéces</label>
            <div  className="chevron-btn bg-secondary">
                {!autrePieceOpened && <i vlas className="fa fa-chevron-down fw-bold text-white"  onClick={() => setAutrePieceOpened(true)} ></i>}
                {autrePieceOpened  && <i vlas className="fa fa-chevron-up fw-bold text-white"    onClick={() => setAutrePieceOpened(false)} ></i>}
            </div>
        </div>
       
        {autrePieceOpened && 
        <div className="form-group mt-4">
            <div className="row">
                <div className="col-12">
                    <label className="fw-bold mb-2">Chambres</label>
                    {<div className="d-flex justify-content-between align-items-center">
                        {["1","2","3","4","5"].map((d,index)=>  
                        <div key={index} className="d-flex justify-content-start align-items-center">
                            <input disabled={bedRooms && bedRooms.length >= 2 && !bedRooms.includes(d)} {...register('bedRooms')} type="checkbox" value={d} className="me-2" /> {d === "5" ? "5+": d}
                        </div>)}
                        </div> }
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-12">
                    <label className="fw-bold mb-2">Sallon(s)</label>
                    {<div className="d-flex justify-content-between align-items-center">
                        {["1","2","3","4","5"].map((d,index)=>  
                        <div key={index} className="d-flex justify-content-start align-items-center">
                            <input disabled={sallons && sallons.length >= 2 && !sallons.includes(d)} {...register('sallons')} type="checkbox" value={d} className="me-2" /> {d === "5" ? "5+": d}
                        </div>)}
                        </div> }
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-12">
                    <label className="fw-bold mb-2">Salle(s) de bain</label>
                    {<div className="d-flex justify-content-between align-items-center">
                        {["1","2","3","4","5"].map((d,index)=>  
                        <div key={index} className="d-flex justify-content-start align-items-center">
                            <input disabled={bathRooms && bathRooms.length >= 2 && !bathRooms.includes(d)} {...register('bathRooms')} type="checkbox" value={d} className="me-2" /> {d === "5" ? "5+": d}
                        </div>)}
                        </div> }
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-12">
                    <label className="fw-bold mb-2">Toilette</label>
                    {<div className="d-flex justify-content-between align-items-center">
                        {["1","2","3","4","5"].map((d,index)=>  
                        <div key={index} className="d-flex justify-content-start align-items-center">
                            <input disabled={toilets && toilets.length >= 2 && !toilets.includes(d)} {...register('toilet')} type="checkbox" value={d} className="me-2" /> {d === "5" ? "5+": d}
                        </div>)}
                        </div> }
                </div>
            </div>
          
            {
            <div className="form-group mt-4">
                <label className="fw-bold">Autres piéces</label>
                <div className="mt-2 fw-bold"><input disabled={otherRooms && otherRooms.length >= 2 && !otherRooms.includes('kitchen')} {...register('otherRooms')} type="checkbox" value={"kitchen"} /> <span className="ms-2">Cuisine</span></div>
                <div className="mt-2 fw-bold"><input disabled={otherRooms && otherRooms.length >= 2 && !otherRooms.includes('balcon')} {...register('otherRooms')} type="checkbox" value={"balcon"} /> <span className="ms-2">Balcon</span></div>
                <div className="mt-2 fw-bold"><input disabled={otherRooms && otherRooms.length >= 2 && !otherRooms.includes('espacefamiliale')} {...register('otherRooms')} type="checkbox" value={"espacefamiliale"} /> <span className="ms-2">Espace Familiale</span></div>
            </div>}
        </div>}
       </div>
       
    </div>
        <button
            type="submit"
            style={{
                position: 'absolute',
                bottom: '10px',
                left: "0",
                right: '0',
                width: "200px",
                height: "45px",
                border: 'none',
                outline: 'none',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}
            className="btn  fw-bold text-white bg-secondary">
            Appliquer le filtre
        </button>
       </form>
    </>
    )
}