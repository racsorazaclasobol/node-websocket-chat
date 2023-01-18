const validarArchivo = ( req = request, res = response, next ) => {

    if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({ msg:'No se han seleccionado archivos.' });

    next();

}

export { validarArchivo }