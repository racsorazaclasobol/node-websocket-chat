import { request, response } from "express";
import Role from "../models/role.js";

const isAdminRole = async( req = request, res = response, next ) => {

    if( !req.usuarioAutenticado ) return res.status(500).json({ msg: 'Ha intentado validar el rol antes que el token.' })

    const { rol } = req.usuarioAutenticado;

    const existe = await Role.findOne({ rol });

    if( !existe ) return res.status(401).json({ msg: `El rol '${ rol }' no está registrado en la Base de datos` });

    if( rol !== 'ADMIN_ROLE' ) return res.status(401).json({ msg: 'No tiene los privilegios necesarios.' });

    next();
}

export {
    isAdminRole
}