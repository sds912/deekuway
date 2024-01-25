import { Checkbox, Select } from "antd";
import { useEffect, useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import './PostFilterForm.css';
import { EnvironmentOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { deleteFilterParams, loadFilterParams, saveFilterParams } from "../../services/localStorageService";
export const PostFilterForm = ({onSubmitFilter, resultsize}) => {

	const [address, setAddress] = useState('');
	const [typePropertyOpened, setTypePropertyOpened] = useState(true);
	const [autrePieceOpened, setAutrePieceOpened] = useState(true);
	const {register, handleSubmit ,  setValue, watch, getValues,  reset, resetField,  formState: { errors },} = useForm();

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
        saveFilterParams(data);
        onSubmitFilter(data);
      }


      const option = watch('mode');

     useEffect(() => {
       const param = loadFilterParams();
       if(param !== null){
        setValue('mode',param.mode);
        setValue('bedRooms', param.bedRooms);
        setValue('property', param.property);
        setValue('otherRooms', param.otherRooms);
        setValue('minPrice', param.minPrice);
        setValue('maxPrice', param.maxPrice);
        filter(param);
       }
      
     },[])
      

    return (
     <>  
    <form onSubmit={handleSubmit(filter)} className="form" id="filter-form" key={'filter-form'} >

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
                className="btn btn-outline-danger"
                onClick={() => {
                    reset();
                    deleteFilterParams();

                }}
                >
                    RESET
                </button>
            </div>

        </div>
        
        <div className="form-group py-2">
          <div className="d-flex justify-content-between align-items-center">
             <label for="filter-location" className={(option && option.includes('location') )? "option option-active" : "option"}>
                 Location
                 <input {...register('mode')} value="location" type='checkbox' id="filter-location" style={{
                    visibility: 'hidden'
                 }} />
             </label>
             <label for="filter-co-loc" className={(option && option.includes('co-loc') )? "option option-active" : "option"}>
                 Co-location
                 <input  {...register('mode')} value="co-loc" type='checkbox' id="filter-co-loc" style={{
                    visibility: 'hidden'
                 }} />
             </label>
             <label for="filter-vente" className={(option && option.includes('vente') )? "option option-active" : "option"}>
                 Vente
                 <input  {...register('mode')} value="vente" type='checkbox' id="filter-vente" style={{
                    visibility: 'hidden'
                 }} />
             </label>
             
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
        <div className="form-group mt-4">
            <label className="fw-bold text-muted">Votre budget</label>
            <div className="row">
                <div className="col-6">
                <label className="fw-bold">Min</label>
                <input className="form-control w-100 fw-bold" placeholder="50 000" {...register('minPrice')}  />
                </div>
                <div className="col-6">
                <label className="fw-bold">Max</label>
                <input className="form-control w-100 fw-bold" placeholder="150 000" {...register('maxPrice')} />
                </div>
            </div>
        </div>
        <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center bg-light p-2 border" style={{borderRadius: '4px'}}>
                <label className="fw-bold text-muted">Type de propriété</label>
                <div className="chevron-btn">
                    {!typePropertyOpened && <i vlas className="fa fa-chevron-down fw-bold text-white"  onClick={() => setTypePropertyOpened(true)} ></i>}
                    {typePropertyOpened  && <i vlas className="fa fa-chevron-up fw-bold text-white"    onClick={() => setTypePropertyOpened(false)} ></i>}
                </div>
            </div>
            { typePropertyOpened &&
            <div className="form-group mt-4">
                    <div className="mt-2 fw-bold"><input type="checkbox" value={'appartement'} {...register('property')} /> <span className="ms-2">Appartement</span></div>
                    <div className="mt-2 fw-bold"><input type="checkbox" value={'studio'} {...register('property')} /> <span className="ms-2">Studio</span> </div>
                    <div className="mt-2 fw-bold"><input type="checkbox" value={'chambre'} {...register('property')} /> <span className="ms-2">Chambre</span> </div>
                    <div className="mt-2 fw-bold"><input type="checkbox" value={'maison'} {...register('property')} /> <span className="ms-2">Maison</span> </div>
                    <div className="mt-2 fw-bold"><input type="checkbox" value={'bureau'} {...register('property')} /> <span className="ms-2">Bureau</span> </div>
                    <div className="mt-2 fw-bold"><input type="checkbox" value={'magasin'} {...register('property')} /> <span className="ms-2">Magasin</span> </div>
            </div>}
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3 bg-light p-2 border"  style={{borderRadius: '4px'}}>
            <label className="fw-bold text-muted">Piéces</label>
            <div  className="chevron-btn">
                {!autrePieceOpened && <i vlas className="fa fa-chevron-down fw-bold text-white"  onClick={() => setAutrePieceOpened(true)} ></i>}
                {autrePieceOpened  && <i vlas className="fa fa-chevron-up fw-bold text-white"    onClick={() => setAutrePieceOpened(false)} ></i>}
            </div>
        </div>
       
        {autrePieceOpened && <div className="form-group mt-4">
            <div className="row">
                <div className="col-12">
                    <label className="fw-bold">Chambres</label>
                    <div className="d-flex justify-content-between align-items-center">
                        {["1","2","3","4","5","6"].map( d =>  
                        <div className="d-flex justify-content-start align-items-center">
                            <input {...register('bedRooms')} type="checkbox" value={d} className="me-2" /> {d === "6" ? "6+": d}
                        </div>)}
                    </div>
                </div>
            </div>
          
            {
            <div className="form-group mt-4">
                <label className="fw-bold">Autres piéces</label>
                <div className="mt-2 fw-bold"><input {...register('otherRooms')} type="checkbox" value={"bathRooms"} /> <span className="ms-2">Salle de bain</span> </div>
                <div className="mt-2 fw-bold"><input {...register('otherRooms')} type="checkbox" value={"toilet"} /> <span className="ms-2">Toilette</span> </div>
                <div className="mt-2 fw-bold"><input {...register('otherRooms')} type="checkbox" value={"sallon"} /> <span className="ms-2">Sallon</span></div>
                <div className="mt-2 fw-bold"><input {...register('otherRooms')} type="checkbox" value={"kitchen"} /> <span className="ms-2">Cuisine</span></div>
                <div className="mt-2 fw-bold"><input {...register('otherRooms')} type="checkbox" value={"balcon"} /> <span className="ms-2">Balcon</span></div>
                <div className="mt-2 fw-bold"><input {...register('otherRooms')} type="checkbox" value={"espacefamiliale"} /> <span className="ms-2">Espace Familiale</span></div>
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
                backgroundColor: '#02627a',
                border: 'none',
                outline: 'none',
                marginLeft: 'auto',
                marginRight: 'auto'
            }}
            className="btn  fw-bold text-white">
            Appliquer le filtre
        </button>
       </form>
    </>
    )
}