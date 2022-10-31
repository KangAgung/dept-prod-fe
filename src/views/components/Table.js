import {
  Box,
  Card, CardContent, CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  TableSortLabel, Button
} from "@material-ui/core";
import React from "react";
import {ArrowForward} from "@material-ui/icons";

function TableComponent(props) {
  return (
    <Card>
      <CardHeader title={(
        <Box sx={{p: 1}}>
          <Typography variant={props.variantTitle || 'h5'}>
            {props.name}
          </Typography>
        </Box>
      )} />
      <CardContent>
        <TableContainer>
          <Table size={props.size}>
            <TableHead>
              <TableRow>
                {props.number && (
                  <TableCell align={'center'}>
                    <b>No.</b>
                  </TableCell>
                )}
                {
                  props.sortable ? props.tableHead.map((item) => (
                      <TableCell
                        align={'center'}
                        key={item.id}
                        sortDirection={props.orderBy === item.id ? props.order : false}
                      >
                        <TableSortLabel
                          active={props.orderBy === item.id}
                          direction={props.orderBy === item.id ? props.order : 'asc'}
                          onClick={props.requestSort(item.id)}
                        >
                          <b>{item.name}</b>
                        </TableSortLabel>
                      </TableCell>
                    )) :
                    props.tableHead.map((item) => (
                      <TableCell key={item.id} align={'center'}>
                        <b>{item.name}</b>
                      </TableCell>
                    ))
                }
                {props.action && (
                  <TableCell align={'center'}>
                    <b>Aksi</b>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.children}
            </TableBody>
            <TableFooter>
              {props.pagination && (<TableRow>
                <TablePagination
                  count={props.pagination.pageData.total || 0}
                  onPageChange={props.pagination.handlePageChange}
                  page={props.pagination.pageData.current_page - 1 || 0}
                  rowsPerPage={parseInt(props.pagination.pageData.per_page) || 10}
                  onRowsPerPageChange={props.pagination.handleChangeRowsPerPage}
                />
              </TableRow>)}
            </TableFooter>
          </Table>
        </TableContainer>
        {props.link && (
          <Box
            sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2}}
          >
            <Button
              onClick={props.link.click}
              variant={'text'}
              size='small'
              color={"primary"}
              endIcon={<ArrowForward/>}
            >
              {props.link.name}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default TableComponent;
