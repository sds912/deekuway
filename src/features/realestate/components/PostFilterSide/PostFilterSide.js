import './PostFilterSide.css';
import { PostFilterForm } from "../PostFilterForm/PostFilterForm";
export const PostFilterSide = ({onSubmitFilter, setResultSize}) => {

    return (
     <div style={{
        position: 'relative',
        width: "300px",
        marginTop: '100px',
         }} className=" p-2 bg-light">  
       <PostFilterForm onSubmitFilter={onSubmitFilter} resultsize={setResultSize} />
    </div>
    )
}