import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import firebase from '../../services/firebaseConfig';
import { DatePicker, Image, message } from 'antd';
import './PostForm.css';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Loader from '../Loader/Loader';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined,
  FileAddOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import appart from '../../../../assets/appartment.png';
import shop from '../../../../assets/boutique.png';
import bureau from '../../../../assets/bureau.png';
import chambre from '../../../../assets/chambre.png';
import coLoc from '../../../../assets/co-location.png';
import location from '../../../../assets/location.png';
import maison from '../../../../assets/maison.png';
import studio from '../../../../assets/studio.png';
import vente from '../../../../assets/vente.png';
import boutique from '../../../../assets/boutique.png';

dayjs.extend(customParseFormat);
const dateFormat = 'YYYY/MM/DD';

const propertyTypes = [
  { name: "Appartement", value: "appartement", icon: <Image src={appart} preview={false} /> },
  { name: "Studio", value: "studio", icon: <Image src={studio} preview={false} /> },
  { name: "Chambre", value: "chambre", icon: <Image src={chambre} preview={false} /> },
  { name: "Maison", value: "maison", icon: <Image src={maison} preview={false} /> },
  { name: "Bureau", value: "bureau", icon: <Image src={bureau} preview={false} /> },
  { name: "Magasin", value: "magasin", icon: <Image src={boutique} preview={false} /> },
];

const otherRooms = [
  { id: '4', name: 'Balcon', value: 'balcon' },
  { id: '5', name: 'Espace familiale', value: 'espacefamiliale' },
  { id: '6', name: 'Cuisine', value: 'kitchen' },
  { id: '7', name: 'Cuisine avec placard', value: 'kitchen' },
];

const facilities = [
  { id: '1', name: 'Ascenseur', value: 'ascenseur' },
  { id: '2', name: 'Suppresseur', value: 'suppresseur' },
  { id: '3', name: 'Guardien', value: 'guardien' },
  { id: '4', name: 'Video surveillance', value: 'video' },
  { id: '5', name: 'Wifi', value: 'wifi' },
  { id: '6', name: 'Climatiseur', value: 'clim' },
  { id: '7', name: "Reservoir d'eau", value: 'reservoir' },
];

export const PostForm = ({ closeModel }) => {
  const auth = firebase.auth();
  const firestore = firebase.firestore();
  const storage = firebase.storage();
  const [messageApi, contextHolder] = message.useMessage();
  const [address, setAddress] = useState('');
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors, touchedFields },
    trigger
  } = useForm();

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(Array.from(new Set([...images, ...selectedImages])));
  };

  const handleSelect = async (address) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      setValue('latitude', latLng.lat);
      setValue('longitude', latLng.lng);
      setValue('address', address);
      setAddress(address);
    } catch (error) {
      message.error(error.message);
    }
  };

  const onCloseModel = () => {
    closeModel();
  };

  const onAddPost = async (data) => {
    setLoading(true);
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = firestore.collection('user').doc(user.uid);
        const userData = (await userRef.get()).data();
        const imageUrls = await Promise.all(images.map(async (imageFile) => {
          const storageRef = storage.ref(`images/${imageFile.name}`);
          await storageRef.put(imageFile);
          return await storageRef.getDownloadURL();
        }));

        const ownerInfo = {
          email: userData.email,
          name: auth.currentUser.displayName,
          phone: userData.phone,
          avatar: auth.currentUser.photoURL,
          uid: auth.currentUser.uid
        };

        const postRef = firestore.collection('posts');
        const postData = {
          ...data,
          images: imageUrls,
          owner: ownerInfo,
          mode: selectedMode,
          type: selectedType,
          price: parseFloat(getValues('price')),
          title: `${selectedMode} ${selectedType}`,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        postRef.add(postData)
          .then(() => {
            message.success("Votre annonce a été envoyée avec succès");
            resetForm();
            onCloseModel();
          })
          .catch(() => {
            message.error("Erreur d'envoi");
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        navigate('/auth');
      }
    });
  };

  const next = () => {
    if (['chambre', 'magasin'].includes(selectedType) && step === 3) {
      setStep(5);
    } else {
      setStep((prevStep) => Math.min(prevStep + 1, 5));
    }
  };

  const prev = (event) => {
    event.stopPropagation();
    if (['chambre', 'magasin'].includes(selectedType) && step === 5) {
      setStep(3);
    } else {
      setStep((prevStep) => Math.max(prevStep - 1, 1));
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    reset();
    setStep(1);
    setSelectedMode(null);
    setSelectedType(null);
    setImages([]);
    setAddress('');
  };

  const price = watch('price', null);
  const priceBy = watch('priceBy', null);
  const available = watch('available', true);
  const bedRooms = watch('bedRooms', null);

  // Sync DatePicker value with form state
  useEffect(() => {
    if (available && available !== 'now') {
      setValue('available', dayjs(available));
    }
  }, [available, setValue]);

  return (
    <div className="container px-0">
      {loading && <Loader />}
      {contextHolder}
      {!loading ? (
        <form onSubmit={handleSubmit(onAddPost)} id='add-post-form' key={'add-post-form'}>
          {step === 1 && (
            <>
              <div className='form-group w-100 my-3'>
                <label className='fw-bold text-muted'>Choisir le type d'annonce (Vente, Location, Co-loc) <span className='text-danger'>*</span></label>
                <div className='row mt-2'>
                  {['location', 'vente', 'co-loc'].map((mode) => (
                    <div className='col' key={mode}>
                      <label
                        htmlFor={`post-${mode}`}
                        className={`p-2 fw-bold ${mode}-option ${selectedMode === mode ? `${mode}-option-active` : ''} text-center`}
                      >
                        <Image src={mode === 'location' ? location : mode === 'vente' ? vente : coLoc} preview={false} />
                        <div className='ms-2'>{mode.charAt(0).toUpperCase() + mode.slice(1)}</div>
                        <input
                          type='radio'
                          id={`post-${mode}`}
                          value={mode}
                          {...register('mode', { required: true })}
                          onChange={() => {
                            setSelectedMode(mode);
                            setValue('mode', mode);
                          }}
                          style={{ visibility: 'hidden', position: 'absolute', width: '0px' }}
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className='form-group mt-5'>
                <label className='form-label fw-bold text-muted'>Choisir le type de propriété <span className='text-danger'>*</span></label>
                <div className='row'>
                  {propertyTypes.map((type) => (
                    <div className='col-4' key={type.value}>
                      <label
                        htmlFor="type"
                        className='mt-3 type-item text-center p-3'
                        onClick={() => {
                          setSelectedType(type.value);
                          setValue('type', type.value);
                        }}
                        style={{
                          width: '100%',
                          display: 'block',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: '7px',
                          border: '1px solid #e5e5e5',
                          fontWeight: 'bold',
                          backgroundColor: selectedType === type.value ? '#ffb703' : ''
                        }}
                      >
                        <div>{type.icon}</div>
                        <span className='ms-2'>{type.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <div className='form-group w-100 mt-5'>
              <label className='form-label fw-bold text-muted'>Ajouter des images (max 10) <span className='text-danger'>*</span></label>
              {errors.images && <div className='text-danger'>Veuillez sélectionner des images</div>}
              <div className='row w-100 px-0'>
                <div className='col-6 px-1'>
                  <label
                    htmlFor="images"
                    style={{ height: '120px', width: '100%', display: 'flex', backgroundColor: '#f2f2f2', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc' }}
                  >
                    <input
                      id='images'
                      type="file"
                      {...register('images', { required: true })}
                      className='form-control w-100'
                      onChange={handleImageChange}
                      multiple
                      style={{ visibility: 'hidden', position: 'absolute' }}
                    />
                    <div><FileAddOutlined size={16} /></div>
                    <div>{images.length} / 10</div>
                  </label>
                </div>
                {images.map((image, index) => (
                  <div key={index} className="col-6 px-1 mt-2" style={{ position: 'relative' }}>
                    <img style={{ height: '120px' }} className='img-fluid w-100' src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                    <CloseCircleOutlined onClick={() => removeImage(index)} style={{ position: 'absolute', top: '2px', left: '2px' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className='form-group w-100 mt-3'>
                <label className='form-label fw-bold text-muted'>Adresse de localisation <span className='text-danger'>*</span></label>
                <PlacesAutocomplete
                  value={address}
                  onChange={handleChange}
                  onSelect={handleSelect}
                  searchOptions={{ componentRestrictions: { country: ['SN'] } }}
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
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                          const style = {
                            backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '5px',
                          };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, { style })}
                              key={suggestion.placeId}
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
              </div>
              <div className='form-group w-100 mt-3'>
                {(selectedMode === 'location' || selectedMode === 'co-loc') && (
                  <>
                    <label className='form-label fw-bold text-muted'>Prix par (Mois, Jour) <span className='text-danger'>*</span></label>
                    <div className='d-flex justify-content-between align-items-center'>
                      <input
                        type="number"
                        {...register("price", { required: true, min: 20000, pattern: { value: /^[0-9]*$/, message: 'Entrer un nombre' } })}
                        className='form-control w-100'
                        onKeyUp={() => trigger('price')}
                        style={{ borderRight: 'none !important' }}
                      />
                      <select
                        defaultValue={null}
                        className='form-select ms-3 w-25'
                        {...register("priceBy", { required: true })}
                      >
                        <option value={null} disabled>Par ...</option>
                        <option value={'jour'}>Jour</option>
                        <option value={'mois'}>Mois</option>
                        <option value={'annee'}>Année</option>
                      </select>
                    </div>
                  </>
                )}
                {selectedMode === 'vente' && (
                  <>
                    <label className='form-label fw-bold text-muted'>Prix de vente <span className='text-danger'>*</span></label>
                    <div className='d-flex justify-content-between align-items-center'>
                      <input
                        type="number"
                        {...register("price", { required: true, min: 20000, pattern: { value: /^[0-9]*$/, message: 'Entrer un nombre' } })}
                        onKeyUp={() => trigger('price')}
                        className='form-control w-100'
                        style={{ borderRight: 'none !important' }}
                      />
                    </div>
                  </>
                )}
                {errors.price && touchedFields.price && <span className='text-danger'>Le prix minimum est de 20000 <span className='text-danger'>*</span></span>}
              </div>
              <label className='form-label fw-bold text-muted mt-3'>Disponibilité <span className='text-danger'>*</span></label>
              <div className='d-flex justify-content-between align-items-center'>
                <div className='bg-light w-100  d-flex justify-content-start align-items-center' style={{ height: '46px' }}>
                  <input
                    id="available"
                    checked={available === 'now' && available !== null}
                    type='checkbox'
                    value="now"
                    onChange={(event) => {
                      setValue('available', event.target.checked ? 'now' : null);
                    }}
                  />
                  <span className='ms-2 '>Immédiate</span>
                </div>
                <div className='w-100 ms-3'>
                  <DatePicker
                    id="available"
                    disabled={available === 'now'}
                    //value={dayjs(available)}
                    format={dateFormat}
                    onChange={(date, dateString) => {
                      setValue('available', dateString);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && !['chambre', 'magasin'].includes(selectedType) && (
            <div>
              <div className='row'>
                <div className='col-12 bg-light border pb-4 mt-4' style={{ borderRadius: '4px' }}>
                  <div className='form-group mt-3'>
                    <label className='form-label fw-bold text-muted'>Chambre(s) <span className='text-danger'>*</span></label>
                    <div className='d-flex justify-content-between'>
                      {[1, 2, 3, 4, 5].map((m) => (
                        <div key={m}>
                          <input type='radio' {...register('bedRooms', { required: true })} value={m} />
                          <span className='ms-2 fw-bold'>{m === 5 ? '5+' : m}</span>
                        </div>
                      ))}
                    </div>
                    {errors.bedRooms && <span className='text-danger'>Veuillez renseigner le nombre de chambres</span>}
                  </div>
                </div>
                <div className='col-12 bg-light border pb-4 mt-4' style={{ borderRadius: '4px' }}>
                  <div className='form-group mt-3'>
                    <label className='form-label fw-bold text-muted'>Sallon(s)</label>
                    <div className='d-flex justify-content-between'>
                      {[1, 2, 3, 4, 5].map((m) => (
                        <div key={m}>
                          <input type='radio' {...register('sallon', { required: true })} value={m} />
                          <span className='ms-2 fw-bold'>{m === 5 ? '5+' : m}</span>
                        </div>
                      ))}
                    </div>
                    {errors.sallon && <span className='text-danger'>Veuillez renseigner le nombre de sallons</span>}
                  </div>
                </div>
                <div className='col-12 bg-light border pb-4 mt-4' style={{ borderRadius: '4px' }}>
                  <div className='form-group mt-3'>
                    <label className='form-label fw-bold text-muted'>Salle(s) de Bain</label>
                    <div className='d-flex justify-content-between'>
                      {[1, 2, 3, 4, 5].map((m) => (
                        <div key={m}>
                          <input type='radio' {...register('bathRooms', { required: true })} value={m} />
                          <span className='ms-2 fw-bold'>{m === 5 ? '5+' : m}</span>
                        </div>
                      ))}
                    </div>
                    {errors.bathRooms && <span className='text-danger'>Veuillez renseigner le nombre de salles de bain</span>}
                  </div>
                </div>
                <div className='col-12 bg-light border pb-4 mt-4' style={{ borderRadius: '4px' }}>
                  <div className='form-group mt-3'>
                    <label className='form-label fw-bold text-muted'>Toilette(s)</label>
                    <div className='d-flex justify-content-between'>
                      {[1, 2, 3, 4, 5].map((m) => (
                        <div key={m}>
                          <input type='radio' {...register('toilets', { required: true })} value={m} />
                          <span className='ms-2 fw-bold'>{m === 5 ? '5+' : m}</span>
                        </div>
                      ))}
                    </div>
                    {errors.toilets && <span className='text-danger'>Veuillez renseigner le nombre de toilettes</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div className='row'>
                <label className='form-label fw-bold text-muted mt-3'>Autres pièces</label>
                {otherRooms.map((room) => (
                  <div className='col-6' key={room.id}>
                    <div className='form-group mt-3'>
                      <input type="checkbox" value={room.value} {...register('otherRooms')} />
                      <span className='ms-2 fw-bold'>{room.name}</span>
                    </div>
                  </div>
                ))}
                <label className='form-label fw-bold text-muted mt-3'>Accessoires</label>
                {facilities.map((facility) => (
                  <div className='col-6' key={facility.id}>
                    <div className='form-group mt-3'>
                      <input type="checkbox" value={facility.value} {...register('facilities')} />
                      <span className='ms-2 fw-bold'>{facility.name}</span>
                    </div>
                  </div>
                ))}
                <div className='form-group w-100 mt-3'>
                  <label className='form-label fw-bold text-muted'>Autres informations</label>
                  <textarea
                    cols={6}
                    {...register("description", { required: false })}
                    className='form-control w-100'
                    style={{ height: '120px !important' }}
                  />
                  {errors.description && <span className='text-danger'>Veuillez ajouter une description</span>}
                </div>
              </div>
            </div>
          )}

          <div className={step > 1 ? 'mt-5 px-2 d-flex justify-content-between align-items-end' : 'mt-5 px-2 d-flex justify-content-end align-items-end'}>
            {step > 1 && (
              <button type='button' onClick={prev} className='btn btn-outline-dark'>
                <ArrowLeftOutlined />
                <span className='ms-3 fw-bold'>Précédent</span>
              </button>
            )}
            {step < 5 && (
              <button
                type='button'
                disabled={!(
                  (step === 1 && (selectedMode && selectedType)) ||
                  (step === 2 && images.length > 0) ||
                  (step === 3 && ((price && address && available && priceBy && selectedMode !== 'vente') || (price && address && available && selectedMode === 'vente'))) ||
                  (step === 4 && bedRooms)
                )}
                onClick={next}
                className='btn btn-outline-warning'
              >
                <span className='me-3 fw-bold'>Suivant</span>
                <ArrowRightOutlined />
              </button>
            )}
            {step === 5 && (
              <button type="submit" className='btn btn-primary fw-bold'>
                Publier
              </button>
            )}
          </div>
        </form>
      ) : <Loader />}
    </div>
  );
};
