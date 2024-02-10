import './PostFilterSide.css';
import { PostFilterForm } from "../PostFilterForm/PostFilterForm";
export const PostFilterSide = ({onSubmitFilter, setResultSize}) => {

    return (
     <div style={{
        position: 'relative',
        width: "300px",
        marginTop: '100px',
        paddingBottom: '40px'
         }} className=" pt-4 px-3 bg-light">  
       <PostFilterForm onSubmitFilter={onSubmitFilter} resultsize={setResultSize} />
    </div>
    )
}