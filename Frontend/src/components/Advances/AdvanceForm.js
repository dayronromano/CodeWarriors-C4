import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

// Graphql
import { useQuery, useMutation } from '@apollo/react-hooks';
import { POST_ADVANCE } from "../../graphql/Advances/mutations"
import { GET_PROJECT_BY_ID } from '../../graphql/Projects/queries'
import { Loading } from '../Loading';
import { useUser } from '../../context/userContext';
import Swal from 'sweetalert2';

const AdvanceForm = (params) => {
    const { userData } = useUser();
    const navigate = useNavigate();
    const { id } = useParams();
    const _id = id;
    const [loader, setLoader] = useState(true);
    const { loading, error, data } = useQuery(GET_PROJECT_BY_ID, { variables: { _id: id } });
    const [project, setProject] = useState({});
    const [state, setState] = useState({
        advance_description: "",
        project_id : "",
        student_id : "",
    })

    const [createAdvance, { data: mutationData, loading: mutationLoading, error: mutationError }] =
        useMutation(POST_ADVANCE);

    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000
    });

    useEffect(() => {
        if (loading === false && data) {
            let datos = data.projectById
            setProject(datos);
        }
        setLoader(loading);
    }, [loading, data])

    useEffect(() => {
        if (mutationData) {
            Toast.fire({
                position: 'top-end',
                title: 'Avance agregado exitosamente!',
                icon: 'success',
                showConfirmButton: false,
            })
            navigate('/advances/' + project._id);
        }
        if (mutationError) {
            Toast.fire({
                position: 'top-end',
                title: 'Error creando',
                icon: 'error',
                showConfirmButton: false,
            })
        }
    }, [mutationError, mutationData]);

    const SubmitForm = (e) => {
        console.log(state)
        e.preventDefault();
        let datos = {
            "project_id": project._id,
            "student_id": userData._id,
            "advance_description": state.advance_description,
            "advance_date" : new Date()
        }
        createAdvance({
            variables: { campos: { ...datos } },
        });
    }

    return (
        <div className="container">
            {
                loader ?
                    <div className="loading d-flex align-items-center justify-content-center">
                        <Loading />
                    </div>
                    :
                    !error ?
                        <div className="row mt-3">
                            <h2>Avances proyecto {project.project_name}</h2>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to={"/advances/"+project._id}>Lista de Avances </Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Crear Avance</li>
                                </ol>
                            </nav>
                            <hr/>
                            <div className="row mt-4">
                                <form
                                    onSubmit={SubmitForm}
                                    className='flex flex-col items-center justify-center'
                                >
                                    <div className="form-outline mb-2">
                                        <label className="form-label">Avances </label>
                                        <textarea
                                            className="form-control"
                                            name="advance_description"
                                            rows="3"
                                            defaultValue={state.advance_description}
                                            onChange={(e) => setState({ ...state, advance_description: e.target.value })}
                                            required
                                        >
                                        </textarea>
                                    </div>
                                    <div className="form-outline mb-2">
                                        <label className="form-label">Observaciones </label>
                                        <textarea
                                            className="form-control"
                                            name="advance_description"
                                            rows="3"
                                            defaultValue={state.leader_observations}
                                            readOnly
                                        >
                                        </textarea>
                                    </div>

                                    <div className="text-center mt-5 mb-5">
                                        <button className="btn btn-primary">
                                            Guardar
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                        :
                        <></>
            }
        </div>
    )

}

export default AdvanceForm