import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import CustomTable from '../../CustomTable';
import RowActionsFile from '../../RowActionsFile';

import axios from 'axios';
import styled from 'styled-components';
import Routes from '@Routes';
import { useDropzone } from 'react-dropzone';
import { SuccessToast } from '../../SuccessToast';
import { File as FileIcon, UploadCloud } from 'react-feather';
import FilePreview from './FilePreview';
import Swal from 'sweetalert2';
import { AlertTriangle } from 'react-feather';

const index = ({ isModalOpen, handleToggleModel, ItemSeries, RefDocType }) => {
  const [attachments, setAttachments] = useState([]);
  const [previewFile, setIsPreviewFile] = useState(false);
  let attachmentNames = useMemo(
    () => attachments?.map((att) => att?.OriginalFileName),
    [attachments]
  );

  const sendAttachment = (acceptedFiles) => {
    let formData = new FormData();
    acceptedFiles?.forEach((img) => {
      formData.append('image', img);
    });

    axios
      .post(
        `${Routes.Attachments.upload}?refDoctype=${RefDocType}&refSeries=${ItemSeries}`,
        formData
      )
      .then(({ data }) => {
        setAttachments((prev) => [...prev, ...data]);
      })
      .catch((err) => console.log('Joseph err', err));
  };

  const onDelete = (row) => {
    axios
      .delete(
        `${Routes.Attachments.delete}?filePath=${row?.FilePath}&filePath=`
      )
      .then(() => {
        toast.success(<SuccessToast msg="Deleted Successfully!" />, {
          hideProgressBar: true,
        });
        setAttachments((prev) =>
          prev.filter((att) => att?.Series !== row?.Series)
        );
      })
      .catch((err) => {
        console.log('Joseph err', err);
        toast.error('There is an error deleting college!', {
          hideProgressBar: true,
        });
      });
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles?.length > 0) {
        if (acceptedFiles.length === 1) {
          if (attachmentNames.includes(acceptedFiles[0]?.name)) {
            Swal.fire({
              title: 'There is already this file exist!',
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: 'Replace File',
              denyButtonText: `Rename File`,
              denyButtonColor: 'orange',
            }).then((result) => {
              if (result.isConfirmed) {
                let replacedFile = attachments?.find((att) => {
                  // let fileName = att?.FilePath.split(/@(.*)/s)[1];
                  return att?.OriginalFileName === acceptedFiles[0]?.name;
                });

                axios
                  .delete(
                    `${Routes.Attachments.delete}?filePath=${replacedFile?.FilePath}&filePath=`
                  )
                  .then(() => {
                    setAttachments((prev) =>
                      prev.filter((att) => att?.Series !== replacedFile?.Series)
                    );

                    sendAttachment(acceptedFiles);

                    toast.success(
                      <SuccessToast msg="Replaced Succeffuly Successfully!" />,
                      {
                        hideProgressBar: true,
                      }
                    );
                  });

                // attachments.find(att => att?.)
              } else if (result.isDenied) {
                let blob = acceptedFiles[0].slice(
                  0,
                  acceptedFiles[0].size,
                  acceptedFiles[0].type
                );
                let fileIndex = 2;
                let newFileName = `${
                  acceptedFiles[0].name.split('.')[0]
                }(${fileIndex}).${acceptedFiles[0].name.split('.')[1]}`;

                while (attachmentNames.includes(newFileName)) {
                  newFileName = `${
                    acceptedFiles[0].name.split('.')[0]
                  }(${fileIndex}).${acceptedFiles[0].name.split('.')[1]}`;
                  fileIndex++;
                }
                const newFile = new File([blob], newFileName, {
                  type: acceptedFiles[0].type,
                });

                let formData = new FormData();
                [newFile]?.forEach((img) => {
                  formData.append('image', img);
                });

                axios
                  .post(
                    `${Routes.Attachments.upload}?refDoctype=${RefDocType}&refSeries=${ItemSeries}`,
                    formData
                  )
                  .then(({ data }) => {
                    setAttachments((prev) => [...prev, ...data]);
                    toast.success(
                      <SuccessToast msg="Renamed Successfully!" />,
                      {
                        hideProgressBar: true,
                      }
                    );
                  })
                  .catch((err) => console.log('Joseph err', err));
              }
            });
          } else {
            // if upload one file
            sendAttachment(acceptedFiles);
          }
        } else {
          // upload mutltiple
          const acceptedFileNames = acceptedFiles.map((file) => file?.name);
          const duplicateNames = attachmentNames.filter((element) =>
            acceptedFileNames.includes(element)
          );
          if (duplicateNames?.length > 0) {
            Swal.fire({
              title: `There is ${duplicateNames?.length} files thats already in this destination!`,
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonText: 'Replace All',
              denyButtonText: `Rename All`,
              denyButtonColor: 'orange',
            }).then((result) => {
              if (result.isConfirmed) {
                // Replace all of them
                const replacedFiles = attachments.filter((att) => {
                  return duplicateNames.includes(att?.OriginalFileName);
                });
                let customFilePaths = '';
                replacedFiles.map((att, index) => {
                  if (index !== replacedFiles?.length - 1)
                    customFilePaths += `${att?.FilePath}&filePath=`;
                  else {
                    customFilePaths += att?.FilePath;
                  }
                });

                axios
                  .delete(
                    `${Routes.Attachments.delete}?filePath=${customFilePaths}`
                  )
                  .then(() => {
                    setAttachments((prev) =>
                      prev.filter((att) => {
                        return !replacedFiles.some((repAtt) => {
                          return repAtt?.Series === att?.Series;
                        });
                      })
                    );

                    sendAttachment(acceptedFiles);

                    toast.success(
                      <SuccessToast msg="Replaced Succeffuly Successfully!" />,
                      {
                        hideProgressBar: true,
                      }
                    );
                  });

                // Remove all duplicate file and upload acceptedFiles
                Swal.fire('Replaced All!', '', 'success');
              } else if (result.isDenied) {
                let tempRenames = [];
                let tempRenamesDone = [];
                let tempOriginals = [];
                acceptedFiles.map((acc) => {
                  if (attachmentNames.includes(acc.name)) tempRenames.push(acc);
                  else tempOriginals.push(acc);
                });

                tempRenames.forEach((elem, index) => {
                  let blob = [elem][0].slice(0, elem.size, elem.type);

                  let fileIndex = 2;
                  let newFileName = `${elem.name.split('.')[0]}(${fileIndex}).${
                    elem.name.split('.')[1]
                  }`;

                  while (attachmentNames.includes(newFileName)) {
                    newFileName = `${elem.name.split('.')[0]}(${fileIndex}).${
                      elem.name.split('.')[1]
                    }`;
                    fileIndex++;
                  }

                  const newFile = new File([blob], newFileName, {
                    type: acceptedFiles[0].type,
                  });
                  tempRenamesDone.push(newFile);
                });

                let formData = new FormData();
                [...tempOriginals, ...tempRenamesDone]?.forEach((img) => {
                  formData.append('image', img);
                });

                axios
                  .post(
                    `${Routes.Attachments.upload}?refDoctype=${RefDocType}&refSeries=${ItemSeries}`,
                    formData
                  )
                  .then(({ data }) => {
                    setAttachments((prev) => [...prev, ...data]);
                    toast.success(
                      <SuccessToast msg="Renamed Successfully!" />,
                      {
                        hideProgressBar: true,
                      }
                    );
                  })
                  .catch((err) => console.log('Joseph err', err));
              }
            });
          } else {
            // upload mutilple without duplicate
            sendAttachment(acceptedFiles);
          }
        }
      }
    },
    [attachments]
  );

  useEffect(() => {
    axios
      .get(
        `${Routes.Attachments.read}?RefDoctype=${RefDocType}&RefSeries=${ItemSeries}`
      )
      .then(({ data }) => {
        setAttachments(data?.rows);
      })
      .catch((err) => console.log('Joseph err attachment'));
  }, [ItemSeries]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    open,
  } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        [],
      'image/gif': [],
      'image/jpeg': [],
      'image/png': [],
    },
  });

  const _columns = [
    {
      name: 'File',
      cell: (row) => <p>{row?.OriginalFileName}</p>,
    },
  ];

  _columns.push({
    name: 'activity',
    maxWidth: '165px',
    cell: (row) => (
      <RowActionsFile
        row={row}
        onPreview={() => setIsPreviewFile(row)}
        onDownload={() => true}
        onDelete={() => onDelete(row)}
      />
    ),
  });

  return (
    <Modal
      size="lg"
      isOpen={isModalOpen}
      toggle={() => handleToggleModel(false)}
    >
      <ModalHeader toggle={() => handleToggleModel(false)}>
        Attachments
      </ModalHeader>
      <ModalBody>
        <ModalContainer {...getRootProps()} className="uploadContainer">
          <input {...getInputProps()} />
          {isDragActive && (
            <div className="overlayUploader">
              {isDragAccept && (
                <AcceptDiv>
                  <p>
                    <FileIcon />
                  </p>
                  <p>Drag & Drop files here</p>
                </AcceptDiv>
              )}

              {isDragReject && (
                <RejectDiv>
                  <p>
                    <AlertTriangle />
                  </p>
                  <p>This File Type is not accpeted!</p>
                </RejectDiv>
              )}
            </div>
          )}
          <CustomTable offlineData={attachments} columns={_columns} />
        </ModalContainer>
        <h6 style={{ color: 'gray' }}>
          <UploadCloud size="20" /> Drop files here to attach or{' '}
          <BrowseText onClick={open}>browse</BrowseText>
        </h6>
      </ModalBody>
      {previewFile && (
        <FilePreview
          previewFile={previewFile}
          setIsPreviewFile={setIsPreviewFile}
        />
      )}
    </Modal>
  );
};

const ModalContainer = styled.div`
  position: relative;

  &:focus {
    border: none !important;
    outline: none !important ;
  }

  .overlayUploader {
    position: absolute;
    top: 0;
    left: 0;
    background-color: blue;
    width: 100%;
    height: 100%;
    z-index: 10;
    background: #000000b8;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: white;
  }
`;
const BrowseText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  color: green;
  width: fit-content;
`;

const AcceptDiv = styled.div`
  font-weight: bolder;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const RejectDiv = styled.div`
  color: red;
  font-weight: bolder;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
export default index;
