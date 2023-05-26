import { Box, Button, Card, Modal, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useKeyDown } from '../../../hooks/useKeyDown';
import CommentCard from './components/CommentCard';
import Cookies from 'js-cookie';
import Axios from '../../AxiosInstance';
import { AxiosError } from 'axios';

const CommentModal = ({ open = false, handleClose = () => { } }) => {
  const [textField, setTextField] = useState('');
  const [comments, setComments] = useState([]);

  useKeyDown(() => {
    handleAddComment();
  }, ['Enter']);

  const valiDateComment = () => {
    let isValid = true;
    if (!textField) {
      isValid = false;
    }

    return isValid;
  }

  useEffect(() => {
    const userToken = Cookies.get('UserToken');
    if (userToken === undefined || userToken === 'undefined') return;

    const fetchData = async () => {
      try {
        const response = await Axios.get('/comment', {
          headers: { Authorization: `Bearer ${userToken}` },
        }).then((res)=>{
          setComments([
            {id:res.data.data.comment.creatorId,
            msg:res.data.data.comment.text},
          ]);
        });
    

      } catch (error) {
        // Handle error if the request fails
        console.error(error);
      }
    };

    fetchData();
  }, []);


  const handleAddComment = async () => {
    // TODO implement logic
    if (!valiDateComment()) {
      return;
    }

    try {
      const userToken = Cookies.get('UserToken');
      const response = await Axios.post(
        '/comment',
        {
          text: textField,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      const newComment = {
        id: response.data.data.id,
        msg: response.data.data.text,
      };

      setComments([...comments, newComment]);
      setTextField('');
    } catch (error) {
      // Handle error if the request fails
      console.error(error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Card
        sx={{
          width: { xs: '60vw', lg: '40vw' },
          maxWidth: '600px',
          maxHeight: '400px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '16px',
          backgroundColor: '#ffffffCC',
          p: '2rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <TextField
            value={textField}
            onChange={(e) => setTextField(e.target.value)}
            fullWidth
            placeholder="Type your comment"
            variant="standard"
          />
          <Button onClick={handleAddComment}>Submit</Button>
        </Box>
        <Box
          sx={{
            overflowY: 'scroll',
            maxHeight: 'calc(400px - 2rem)',
            '&::-webkit-scrollbar': {
              width: '.5rem', // chromium and safari
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#999999',
              borderRadius: '10px',
            },
          }}
        >
          {comments.map((comment) => (
            <CommentCard comment={comment} key={comment.id} />
          ))}
        </Box>
      </Card>
    </Modal>
  );
};

export default CommentModal;
