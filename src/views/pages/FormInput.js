import React, {useEffect, useState} from "react";
import {
  Box,
  Button,
  Card,
  CardContent, CardHeader,
  Grid, InputAdornment, MenuItem, Paper,
  Snackbar,
  TableCell,
  TableRow,
  TextField, Typography
} from "@material-ui/core";
import LuxonUtils from "@date-io/luxon";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import {DateTime} from "luxon";
import {Alert} from "@material-ui/lab";
import TableComponent from "../components/Table";
import stringFormatter from "../../utils/string-formatter";
import Api from "../../data/api";
import numberFormatter from "../../utils/number-formatter";

const header = [
  {
    id: 'kode',
    name: "Kode Barang",
  },
  {
    id: 'nama',
    name: "Nama Barang",
  },
  {
    id: 'qty',
    name: 'Qty'
  }
  ,
  {
    id: 'harga_bandrol',
    name: 'Harga Bandrol'
  }
  ,
  {
    id: 'diskon_pct',
    name: 'Diskon (%)'
  },
  {
    id: 'diskon_nilai',
    name: 'Diskon (Rp)'
  },
  {
    id: 'harga_diskon',
    name: 'Harga Diskon'
  },
  {
    id: 'total',
    name: 'Total'
  }
];

function FormInput() {
  const [selectedDate, handleDateChange] = useState(DateTime.now().setZone('asia/jakarta'));
  const [value, setValue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({status: false, message: 'Tidak dapat memuat data', type: 'error'});
  const [kode, setKode] = useState("");
  const [customer, setCustomer] = useState({
    id: "", kode: "", name: "", telp: ""
  });
  const [barang, setBarang] = useState({});
  const [lovCustomer, setLovCustomer] = useState([]);
  const [lovBarang, setLovBarang] = useState([]);
  const [final, setFinal] = useState({
    subtotal: 0, diskon: 0, ongkir: 0, total_bayar: 0
  });

  useEffect(()=>{
    setLoading(true);
    Promise.all([Api.Barang.getAll(), Api.Customer.getAll() ])
      .then(response => {
        setLovBarang(response[0].data.data);
        setLovCustomer(response[1].data.data);
        setLoading(false);
      }).catch( e => {
        setLoading(false);
        setError({status: true, message: e.response?.data?.message || "Periksa koneksi internet anda", type: 'error' });
    })
    setKode(`${selectedDate.year}${selectedDate.month}-${selectedDate.day}${selectedDate.minute}${selectedDate.second}`);
  },[]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      tgl: selectedDate.toISO(),
      kode: kode,
      cust_id: customer.id,
      subtotal : getTotalHarga(),
      diskon: Number(final.diskon),
      ongkir: Number(final.ongkir),
      total_bayar: getTotalHarga() - Number(final.diskon) + Number(final.ongkir),
      barang: value,
    };
    Api.Sales.post(data)
      .then( r => {
        handleClearItem();
        setLoading(false);
        setError({status: true, message: r.data.message || "Berhasil melakukan transaksi", type: 'success' });
      })
      .catch(e => {
        setLoading(false);
        setError({status: true, message: e.response?.data?.message || "Periksa koneksi internet anda", type: 'error' });
      });
  };

  const handleBarangSelect = (event) => {
    const filtered = lovBarang.filter(({id: values}) => {
      return values === event.target.value;
    });
    setBarang(filtered[0]);
  };

  const handleCustSelect = (event) => {
    const filtered = lovCustomer.filter(({id: values}) => {
      return values === event.target.value;
    });
    setCustomer(filtered[0]);
  };

  const handleCart = (item) => {
    const data = {...item, qty: 1, diskon_pct: 0};
    const filtered = value.filter(({id: values}) => {
      return values === data.id;
    });
    if (filtered.length < 1){
      setValue([...value, data]);
    }
  };

  const handleChange = (event, index) => {
    const list = [...value];
    list[index][event.target.name] = Number(event.target.value);
    setValue(list);
  };

  const handleRemoveItem = (id) => {
    const filtered = value.filter(({id: values}) => {
      return values !== id;
    });
    setValue(filtered);
  };

  const handleClearItem = () => {
    setValue([]);
  };

  const handleFinalChange = (event) => {
    setFinal({ ...final, [event.target.name]: event.target.value });
  };

  const getTotalHarga = () => {
    return value.reduce((total, item) => {
      return total + ((Number(item.harga) - (Number(item.harga) * item.diskon_pct / 100)) * Number(item.qty));
    }, 0);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={2}
          justifyContent={'flex-start'}
          alignItems={'center'}
          style={{marginBottom: '5vh'}}
        >
          <Grid item>
            <Card>
              <CardHeader title={"Transaksi"} />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item>
                    <TextField
                      variant={'outlined'}
                      name={'kode'}
                      label={"Kode Transaksi"}
                      disabled={true}
                      value={kode}
                    />
                  </Grid>
                  <Grid item>
                    <MuiPickersUtilsProvider utils={LuxonUtils} locale={'id'}>
                      <DatePicker
                        inputVariant="outlined"
                        format={"DD"}
                        label="Tanggal"
                        value={selectedDate}
                        onChange={handleDateChange}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          justifyContent={'space-between'}
          alignItems={'flex-start'}
          style={{marginBottom: '5vh'}}
        >
          <Grid item xs={12} sm={9}>
            <Card>
              <CardHeader title={"Customer"} />
              <CardContent>
                <Grid
                  container
                  spacing={2}
                >
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Kode"
                      name="kode"
                      variant="outlined"
                      fullWidth
                      disabled
                      value={customer.kode}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      required
                      label="Nama Customer"
                      name="name"
                      fullWidth
                      select
                      variant="outlined"
                      defaultValue={""}
                      value={customer.id}
                      onChange={handleCustSelect}
                    >
                      {
                        lovCustomer.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                      }
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="Telp"
                      name="telp"
                      variant="outlined"
                      fullWidth
                      disabled
                      value={customer.telp}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          justifyContent={'flex-start'}
          alignItems={'center'}
          style={{marginBottom: '5vh'}}
        >
          <Grid item xs={12} sm={4}>
            <Paper elevation={0}>
              <Box sx={{ p: 2}}>
                <TextField
                  label="Nama Barang"
                  name="nama"
                  fullWidth
                  select
                  variant="outlined"
                  defaultValue={""}
                  onChange={handleBarangSelect}
                >
                  {
                    lovBarang.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.nama}
                      </MenuItem>
                    ))
                  }
                </TextField>
              </Box>
            </Paper>
          </Grid>
          <Grid item>
            <Button
              variant={'contained'}
              color={"primary"}
              size={"large"}
              onClick={() => handleCart(barang)}
            >
              Tambah
            </Button>
          </Grid>
        </Grid>

        <Grid container justifyContent={"center"} alignItems={'center'}>
          <Grid item xs={12}>
            <Snackbar
              open={error.status}
              autoHideDuration={6000}
              anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
              onClose={() => setError({status: false, message: ''})}
            >
              <Alert variant="filled" severity={error.type} style={{marginBottom:'2vh'}}>
                {error.message || 'Tidak dapat memuat data'}
              </Alert>
            </Snackbar>
            <TableComponent
              tableHead={header}
              name={"Form Input"}
              action={true}
              number={true}
            >
              {
                value.length < 1 && (
                  <TableRow>
                    <TableCell colSpan={header.length+2} align={'center'}>
                      Tidak ada Barang dalam form
                    </TableCell>
                  </TableRow>
                )
              }
              { value.length > 0 && value.map((item, index) => {
                let hargaBandrol = parseFloat(item.harga);
                let diskon = hargaBandrol * item.diskon_pct / 100;
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {index+1}
                    </TableCell>
                    <TableCell>
                      {item.kode}
                    </TableCell>
                    <TableCell>
                      {stringFormatter(item.nama)}
                    </TableCell>
                    <TableCell>
                      <TextField
                        InputProps={{ inputProps: { min: "1", step: "1" } }}
                        variant={'outlined'}
                        size={'small'}
                        name={'qty'}
                        value={item.qty}
                        type={'number'}
                        onChange={(e) => handleChange(e, index)}
                        required
                      />
                    </TableCell>
                    <TableCell>
                      Rp. {numberFormatter(hargaBandrol)}
                    </TableCell>
                    <TableCell>
                      <TextField
                        InputProps={{ inputProps: { min: "0", step: "1" } }}
                        variant={'outlined'}
                        size={'small'}
                        name={'diskon_pct'}
                        value={item.diskon_pct}
                        type={'number'}
                        onChange={(e) => handleChange(e, index)}
                        required
                      />
                    </TableCell>
                    <TableCell>
                      Rp. {numberFormatter(diskon)}
                    </TableCell>
                    <TableCell>
                      Rp. {numberFormatter(hargaBandrol - diskon)}
                    </TableCell>
                    <TableCell>
                      Rp. {numberFormatter((hargaBandrol - diskon) * item.qty)}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex'}}
                      >
                        <Button
                          variant={'contained'}
                          size='small'
                          color={'secondary'}
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Hapus
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )})}
            </TableComponent>
          </Grid>
        </Grid>
        <Grid
          container
          direction={"row"}
          spacing={2}
          justifyContent={'flex-end'}
          alignItems={'center'}
          style={{marginTop: '1vh'}}
        >
          <Grid item xs={6} sm={3} md={2}>
            <Typography>
              SubTotal :
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2} >
            <TextField
              variant={'outlined'}
              size={'small'}
              name={'subtotal'}
              value={getTotalHarga()}
              type={'number'}
              disabled
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
        <Grid
          container
          direction={"row"}
          spacing={2}
          justifyContent={'flex-end'}
          alignItems={'center'}
          style={{marginTop: '1vh'}}
        >
          <Grid item xs={6} sm={3} md={2}>
            <Typography>
              Diskon :
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2} >
            <TextField
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
                inputProps: { min: "0", step: "1" }
              }}
              variant={'outlined'}
              size={'small'}
              name={'diskon'}
              type={'number'}
              defaultValue={0}
              onChange={handleFinalChange}
              required
            />
          </Grid>
        </Grid>
        <Grid
          container
          direction={"row"}
          spacing={2}
          justifyContent={'flex-end'}
          alignItems={'center'}
          style={{marginTop: '1vh'}}
        >
          <Grid item xs={6} sm={3} md={2}>
            <Typography>
              Ongkir :
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2} >
            <TextField
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp.</InputAdornment>,
                inputProps: { min: "0", step: "1" }
              }}
              variant={'outlined'}
              size={'small'}
              name={'ongkir'}
              type={'number'}
              defaultValue={0}
              onChange={handleFinalChange}
              required
            />
          </Grid>
        </Grid>
        <Grid
          container
          direction={"row"}
          spacing={2}
          justifyContent={'flex-end'}
          alignItems={'center'}
          style={{marginTop: '1vh'}}
        >
          <Grid item xs={6} sm={3} md={2}>
            <Typography>
              Total Bayar :
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4} md={2} >
            <TextField
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp.</InputAdornment>
              }}
              variant={'outlined'}
              size={'small'}
              name={'ongkir'}
              value={getTotalHarga() - Number(final.diskon) + Number(final.ongkir)}
              type={'number'}
              onChange={handleFinalChange}
              disabled
            />
          </Grid>
        </Grid>
        <Grid
          container
          direction={"row"}
          spacing={2}
          justifyContent={'flex-end'}
          alignItems={'center'}
          style={{marginTop: '3vh'}}
        >
          <Grid item xs={6} sm={4} md={2}>
            <Button
              color="primary"
              variant="contained"
              size={"large"}
              type={'submit'}
              disabled={loading || value.length < 1}
            >
              Simpan
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} md={2} >
            <Button
              color="secondary"
              variant="contained"
              size={"large"}
              onClick={() => handleClearItem()}
              disabled={loading || !value.length}
            >
              Batal
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default FormInput;
