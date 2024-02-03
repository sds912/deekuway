
export const FirebaseErrorMessage = (code, message) => {
    
    if(code === "auth/network-request-failed"){
        message.error('Vérifiez votre connexion internet')
    }
}