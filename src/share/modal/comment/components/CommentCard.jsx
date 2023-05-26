import { Button, Card, TextField, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import Axios from '../../../AxiosInstance';
import Cookies from 'js-cookie';

const CommentCard = ({ comment = { id: -1, msg: '' } }) => {
  const [isConfirm, setIsConfirm] = useState(false);
  const [functionMode, setFunctionMode] = useState('update');
  const [msg, setMsg] = useState(comment.msg);

  const submit = useCallback(() => {

    const userToken = Cookies.get('UserToken');
    if (functionMode === 'update') {
      Axios.patch('/comment', { text: msg, commentId: comment.id } ,{
        headers:{Authorization: `Bearer ${userToken}`},
      })
      .then((response) => {
        console.log('Comment updated successfully');
        // Handle the successful update, if needed
      })
      .catch((error) => {
        console.error('Error updating comment:', error);
        // Handle the error, if needed
      });
    } else if (functionMode === 'delete') {
      Axios.delete(`/comment/${comment.id}`,{
        headers:{Authorization: `Bearer ${userToken}`},
      })
      .then((response) => {
        console.log('Comment deleted successfully');
        // Handle the successful deletion, if needed
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
        // Handle the error, if needed
      });
    } else {
      // TODO setStatus (snackbar) to error
      console.log('error');
    }
  }, [functionMode]);

  const changeMode = (mode) => {
    setFunctionMode(mode);
    setIsConfirm(true);
  };

  const cancelAction = () => {
    setFunctionMode('');
    setIsConfirm(false);
  };

  return (
    <Card sx={{ p: '1rem', m: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {!(isConfirm && functionMode == 'update') ? (
        <Typography sx={{ flex: 1 }}>{comment.msg}</Typography>
      ) : (
        <TextField sx={{ flex: 1 }} value={msg} onChange={(e) => setMsg(e.target.value)} />
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('update')} variant="outlined" color="info">
          update
        </Button>
      ) : (
        <Button onClick={submit} variant="outlined" color="success">
          confirm
        </Button>
      )}
      {!isConfirm ? (
        <Button onClick={() => changeMode('delete')} variant="outlined" color="error">
          delete
        </Button>
      ) : (
        <Button onClick={cancelAction} variant="outlined" color="error">
          cancel
        </Button>
      )}
    </Card>
  );
};

export default CommentCard;
