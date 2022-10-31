import React, {useEffect, useState} from "react";
import {
  Box, CircularProgress,
  Grid, makeStyles, TableCell,
  TableRow, IconButton, Collapse, Snackbar,
  Typography, Table, TableHead, TableBody
} from "@material-ui/core";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { Alert } from "@material-ui/lab";
import Toolbar from "../components/Toolbar";
import TableComponent from "../components/Table";
import {DateTime} from "luxon";
import numberFormatter from "../../utils/number-formatter";
import Api from "../../data/api";

const header = [
  {
    id: '',
    name: ''
  },
  {
    id: 't_sales.id',
    name: "No"
  },
  {
    id: 't_sales.kode',
    name: "No Transaksi"
  },
  {
    id: 't_sales.tgl',
    name: "Tanggal",
  },
  {
    id: 'm_customer.name',
    name: "Nama Customer",
  },
  {
    id: 't_sales.jumlah_barang',
    name: 'Jumlah Barang'
  },
  {
    id: 't_sales.subtotal',
    name: "Sub Total"
  },
  {
    id: 't_sales.diskon',
    name: "Diskon"
  },
  {
    id: 't_sales.ongkir',
    name: "Ongkir",
  },
  {
    id: 't_sales.total_bayar',
    name: "Total",
  },
];

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

function Row(props){
  const { row } = props;
  const [open, setOpen] = useState(false);

  const classes = useRowStyles();

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {row.id}
        </TableCell>
        <TableCell>
          {row.kode}
        </TableCell>
        <TableCell>
          {DateTime.fromSQL(row.tgl).setZone('Asia/Jakarta').toLocaleString(DateTime.DATE_HUGE)}
        </TableCell>
        <TableCell>
          {row.name}
        </TableCell>
        <TableCell>
          {row.jumlah_barang}
        </TableCell>
        <TableCell>
          {numberFormatter(Number(row.subtotal))}
        </TableCell>
        <TableCell>
          {numberFormatter(Number(row.diskon))}
        </TableCell>
        <TableCell>
          {numberFormatter(Number(row.ongkir))}
        </TableCell>
        <TableCell>
          {numberFormatter(Number(row.total_bayar))}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Detail Transaksi
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Kode</TableCell>
                    <TableCell>Nama Barang</TableCell>
                    <TableCell>Harga Bandrol</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Diskon (%)</TableCell>
                    <TableCell>Diskon (Rp)</TableCell>
                    <TableCell>Harga Diskon</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.barang.map((item,index) => (
                    <TableRow key={index}>
                      <TableCell>{item.kode}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>Rp. {numberFormatter(Number(item.harga))}</TableCell>
                      <TableCell>{item.pivot.qty}</TableCell>
                      <TableCell>{item.pivot.diskon_pct}%</TableCell>
                      <TableCell>Rp. {numberFormatter(Number(item.pivot.diskon_nilai))}</TableCell>
                      <TableCell>Rp. {numberFormatter(Number(item.pivot.harga_diskon))}</TableCell>
                      <TableCell>Rp. {numberFormatter(Number(item.pivot.total))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function DaftarTransaksi() {
  const [pageData, setPageData] = useState({ data: []});
  const [value, setValue] = useState({
    page: 1, perPage: 10, search: '', orderBy: 't_sales.id', order: 'asc'
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({status: false, message: 'Tidak dapat memuat data', type: 'error'});

  useEffect(() => {
    setLoading(true);
    Api.Sales.getAll(value.page, value.search, value.orderBy, value.order, value.perPage)
      .then(response => {
        setPageData(response.data.data);
        setLoading(false);
      }).catch( e => {
      setLoading(false);
      setError({status: true, message: e.response?.data?.message || "Periksa koneksi internet anda", type: 'error' });
    })
  },[value]);

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setValue({...value, search: search});
  };

  const handlePageChange = (event, newPage) => {
    setValue({...value, page: newPage+1});
  };

  const handleChangeRowsPerPage = (event) => {
    setValue({
      ...value,
      perPage: parseInt(event.target.value, 10),
      page: 1
    });
  };

  const handleRequestSort = (property) => () => {
    const isAsc = value.orderBy === property && value.order === 'asc';
    setValue({
      ...value,
      order: isAsc ? 'desc' : 'asc',
      orderBy: property
    });
  };

  return (
    <>
      <Grid container justifyContent={"center"} alignItems={'center'}>
        <Grid item xs={12}>
          <Snackbar
            open={error.status}
            autoHideDuration={6000}
            anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            onClose={() => setError( {...error, status: false})}
          >
            <Alert variant="filled" severity={error.type} style={{marginBottom:'2vh'}}>
              {error.message || 'Tidak dapat memuat data'}
            </Alert>
          </Snackbar>
          <Toolbar
            search={{change: handleChange, submit: handleSearch}}
            page={"Berdasarkan Nama Customer"}
          />

          <TableComponent
            sortable={true}
            order={value.order}
            orderBy={value.orderBy}
            requestSort={handleRequestSort}
            tableHead={header}
            name={"Daftar Transaksi"}
            pagination={{pageData, handlePageChange, handleChangeRowsPerPage}}
            action={false}
          >
            {loading ? (
              <TableRow>
                <TableCell colSpan={header.length+1} align={'center'}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : pageData.data.map((item, index) => (
              <Row key={index} row={item} onError={setError} />
            ))}
          </TableComponent>
        </Grid>
      </Grid>
    </>
  );
}

export default DaftarTransaksi;
