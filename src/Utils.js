export async function uploadImage(e, { uploadedFileIdInput, fileUploadHint }) {
  const uploadedFileIdInputRef = uploadedFileIdInput;
  const fileUploadHintRef = fileUploadHint;

  const formData = new FormData();
  formData.append('file', e.target.files[0]);
  const response = await fetch('/cgi-bin/koha/tools/upload-file.pl?category=LMSEventManagement&public=1&temp=0', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (result.status === 'done') {
    uploadedFileIdInputRef.value = result.fileid;

    fileUploadHintRef.innerHTML = `
        <i class="fa fa-check" aria-hidden="true">
        </i><span>&nbsp;Upload succeeded</span>
    `;

    return;
  }

  if (result.status === 'failed') {
    /** We briefly check whether we've got an already existing file ('UPLERR_ALREADY_EXISTS')
     *   and assign that id to the image form field to preserve the existing state of the event.
     */
    const errors = result.errors
      ? Object.entries(result.errors).reduce(
        (accumulator, [fileName, { code }]) => `${accumulator}${accumulator ? '\n' : ''}${fileName}: ${code}`,
        '',
      )
      : 'Upload aborted';

    if (errors.includes('UPLERR_ALREADY_EXISTS')) {
      // TODO: Implement handling of already existing images
      uploadedFileIdInputRef.value = '';
    }

    fileUploadHintRef.innerHTML = `
        <i class="fa fa-exclamation" aria-hidden="true"></i>
        <span>&nbsp;Upload had errors: ${errors}</span>
    `;
  }
}

export function updateRangeOutput({ rangeInput, rangeOutput }) {
  const rangeOutputRef = rangeOutput;
  rangeOutputRef.textContent = rangeInput.value === '120' ? '∞' : rangeInput.value;
}
