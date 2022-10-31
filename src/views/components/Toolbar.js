import React from "react";
import {
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton, Grid
} from '@material-ui/core';
import {Search as SearchIcon} from "@material-ui/icons";

const Toolbar = ({btnComponent: Component, ...props}) => {

  return (
    <>
      <Grid
        container
        justifyContent={'space-between'}
        alignItems={'center'}
        style={{marginBottom: '5vh'}}
      >
        <Grid item xs={12} sm={7} md={6}>
          <Card component={'form'} onSubmit={props.search.submit}>
            <CardContent style={{padding: 16}}>
              <TextField
                helperText={"Tekan ENTER untuk mencari"}
                onChange={props.search.change}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type={'submit'} disableRipple >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                placeholder={"Cari "+props.page}
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Toolbar
