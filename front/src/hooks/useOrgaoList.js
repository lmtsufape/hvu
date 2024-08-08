import { useState, useEffect } from 'react';
import { getAllOrgao } from '../../services/orgaoService';

const OrgaosList = () => {
    const [orgaos, setOrgaos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getOrgaos = async () => {
            try {
                const data = await getAllOrgao();
                setOrgaos(data);
            } catch (err) {
                setError(err);
            }
        };

        getOrgaos();
    }, []);

    return { orgaos, error };
};

export default OrgaosList;
