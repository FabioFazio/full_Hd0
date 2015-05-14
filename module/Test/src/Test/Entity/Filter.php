<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;

/** @ORM\Entity */
class Filter {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, unique=true) */
	protected $code;
	
	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $responce;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $question;
	
	/** @ORM\ManyToOne(targetEntity="Filter", inversedBy="responces")
	 *  @ORM\JoinColumn(name="askedBy_id", referencedColumnName="id") 
	 */
	protected $askedBy;
	
	/** @ORM\OneToMany(targetEntity="Filter", mappedBy="askedBy") */
	protected $responces;
	
	public function __construct(){
	    $this->queues = new ArrayCollection();
		$this->responces = new ArrayCollection();
	}

	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }

    public function getCode(){
    	return $this->code;
    }
    
    public function setCode($code){
    	$this->code = $code;
    }
    
    public function getResponce(){
    	return $this->responce;
    }
    
    public function setRresponce($responce){
    	$this->responce = $responce;
    }

    public function getQuestion(){
    	return $this->question;
    }
    
    public function setQuestion($question){
    	$this->question = $question;
    }
    
    public function getAskedBy(){
    	return $this->askedBy;
    }
    
    public function setAskedBy($askedBy){
    	
        if($askedBy === null) {
        	if($this->askedBy !== null) {
        		$this->askedBy->getResponces()->removeElement($this);
        	}
        	$this->askedBy = null;
        } else {
        	if(!$askedBy instanceof Test\Entity\Filter) {
        		throw new InvalidArgumentException(
        		        '$askedBy must be null or instance of Test\Entity\Filter');
        	}
        	if($this->askedBy !== null) {
        		$this->askedBy->getResponces()->removeElement($this);
        	}
        	$this->askedBy = $askedBy;
        	$askedBy->getResponces()->add($this);
        }
    }
    
    public function getResponces() {
    	return $this->responces;
    }
}