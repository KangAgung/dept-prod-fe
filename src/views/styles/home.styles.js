import  { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 250;

const HomeStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
    },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1 + '!important'
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.light,
  },
  content: {
    [theme.breakpoints.up("sm")]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`
    },
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing(0),
    },
  },
  textWhite: {
    color: theme.palette.primary.contrastText,
  },
}));

export default HomeStyles;
